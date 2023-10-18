"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SecretRedactor_instances, _SecretRedactor_rules, _SecretRedactor_redactRuleSecret, _SecretRedactor_keywordHit;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretRedactor = void 0;
const gitleaks_rules_1 = __importDefault(require("./gitleaks_rules"));
const helpers_1 = require("./helpers");
class SecretRedactor {
    constructor() {
        _SecretRedactor_instances.add(this);
        _SecretRedactor_rules.set(this, []);
        __classPrivateFieldSet(this, _SecretRedactor_rules, gitleaks_rules_1.default.map((rule) => ({
            ...rule,
            compiledRegex: new RegExp((0, helpers_1.convertToJavaScriptRegex)(rule.regex), 'gmi'),
        })), "f");
    }
    transform(context) {
        return {
            prefix: this.redactSecrets(context.prefix),
            suffix: this.redactSecrets(context.suffix),
            filename: context.filename,
        };
    }
    redactSecrets(raw) {
        return __classPrivateFieldGet(this, _SecretRedactor_rules, "f").reduce((redacted, rule) => {
            return __classPrivateFieldGet(this, _SecretRedactor_instances, "m", _SecretRedactor_redactRuleSecret).call(this, redacted, rule);
        }, raw);
    }
}
exports.SecretRedactor = SecretRedactor;
_SecretRedactor_rules = new WeakMap(), _SecretRedactor_instances = new WeakSet(), _SecretRedactor_redactRuleSecret = function _SecretRedactor_redactRuleSecret(str, rule) {
    if (!rule.compiledRegex)
        return str;
    if (!__classPrivateFieldGet(this, _SecretRedactor_instances, "m", _SecretRedactor_keywordHit).call(this, rule, str)) {
        return str;
    }
    const matches = [...str.matchAll(rule.compiledRegex)];
    return matches.reduce((redacted, match) => {
        const secret = match[rule.secretGroup ?? 0];
        return redacted.replace(secret, '*'.repeat(secret.length));
    }, str);
}, _SecretRedactor_keywordHit = function _SecretRedactor_keywordHit(rule, raw) {
    if (!rule.keywords?.length) {
        return true;
    }
    for (const keyword of rule.keywords) {
        if (raw.toLowerCase().includes(keyword)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=index.js.map