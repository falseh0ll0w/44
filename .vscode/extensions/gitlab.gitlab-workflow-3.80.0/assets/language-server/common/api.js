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
var _GitLabAPI_instances, _GitLabAPI_completionToken, _GitLabAPI_token, _GitLabAPI_baseURL, _GitLabAPI_clientInfo, _GitLabAPI_useNewApiVersion, _GitLabAPI_isPatToken, _GitLabAPI_checkPatToken, _GitLabAPI_checkOAuthToken, _GitLabAPI_hasValidScopes, _GitLabAPI_getGitLabInstanceVersion, _GitLabAPI_setCodeSuggestionsApiVersion, _GitLabAPI_getCodeSuggestionsV1, _GitLabAPI_getCodeSuggestionsV2, _GitLabAPI_getCompletionToken, _GitLabAPI_getDefaultHeaders;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabAPI = exports.GITLAB_API_BASE_URL = void 0;
const cross_fetch_1 = require("cross-fetch");
const semver_1 = require("semver");
exports.GITLAB_API_BASE_URL = 'https://gitlab.com';
class GitLabAPI {
    constructor(baseURL = exports.GITLAB_API_BASE_URL, token) {
        _GitLabAPI_instances.add(this);
        _GitLabAPI_completionToken.set(this, void 0);
        _GitLabAPI_token.set(this, void 0);
        _GitLabAPI_baseURL.set(this, void 0);
        _GitLabAPI_clientInfo.set(this, void 0);
        _GitLabAPI_useNewApiVersion.set(this, false);
        __classPrivateFieldSet(this, _GitLabAPI_token, token, "f");
        __classPrivateFieldSet(this, _GitLabAPI_baseURL, baseURL, "f");
    }
    async configureApi({ token, baseUrl }) {
        __classPrivateFieldSet(this, _GitLabAPI_token, token, "f");
        __classPrivateFieldSet(this, _GitLabAPI_baseURL, baseUrl, "f");
        await __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_setCodeSuggestionsApiVersion).call(this);
    }
    async checkToken(token) {
        try {
            if (__classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_isPatToken).call(this, token)) {
                return await __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_checkPatToken).call(this, token);
            }
            else {
                return await __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_checkOAuthToken).call(this, token);
            }
        }
        catch (err) {
            return {
                valid: false,
                reason: 'unknown',
                message: `Failed to check token: ${err}`,
            };
        }
    }
    setClientInfo(clientInfo) {
        __classPrivateFieldSet(this, _GitLabAPI_clientInfo, clientInfo, "f");
    }
    async getCodeSuggestions(context) {
        const request = {
            prompt_version: 1,
            project_path: '',
            project_id: -1,
            current_file: {
                content_above_cursor: context.prefix,
                content_below_cursor: context.suffix,
                file_name: context.filename,
            },
        };
        if (__classPrivateFieldGet(this, _GitLabAPI_useNewApiVersion, "f")) {
            return __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getCodeSuggestionsV2).call(this, request);
        }
        return __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getCodeSuggestionsV1).call(this, request);
    }
}
exports.GitLabAPI = GitLabAPI;
_GitLabAPI_completionToken = new WeakMap(), _GitLabAPI_token = new WeakMap(), _GitLabAPI_baseURL = new WeakMap(), _GitLabAPI_clientInfo = new WeakMap(), _GitLabAPI_useNewApiVersion = new WeakMap(), _GitLabAPI_instances = new WeakSet(), _GitLabAPI_isPatToken = function _GitLabAPI_isPatToken(token) {
    const regex = new RegExp(/^glpat-[0-9a-zA-Z-_]{20}$/);
    return regex.test(token);
}, _GitLabAPI_checkPatToken = async function _GitLabAPI_checkPatToken(token) {
    const headers = __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, token);
    const response = await (0, cross_fetch_1.default)(`${__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f")}/api/v4/personal_access_tokens/self`, {
        headers,
    });
    if (response.ok) {
        const { active, scopes } = (await response.json());
        if (!active) {
            return {
                valid: false,
                reason: 'not_active',
                message: 'Token is not active.',
            };
        }
        if (!__classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_hasValidScopes).call(this, scopes)) {
            const joinedScopes = scopes.map((scope) => `'${scope}'`).join(', ');
            return {
                valid: false,
                reason: 'invalid_scopes',
                message: `Token has scope(s) ${joinedScopes} (needs 'api' and 'read_api').`,
            };
        }
        return { valid: true };
    }
    else {
        throw new Error(response.statusText);
    }
}, _GitLabAPI_checkOAuthToken = async function _GitLabAPI_checkOAuthToken(token) {
    const headers = __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, token);
    const response = await (0, cross_fetch_1.default)(`${__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f")}/oauth/token/info`, {
        headers,
    });
    if (response.ok) {
        const { scope: scopes } = (await response.json());
        if (!__classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_hasValidScopes).call(this, scopes)) {
            const joinedScopes = scopes.map((scope) => `'${scope}'`).join(', ');
            return {
                valid: false,
                reason: 'invalid_scopes',
                message: `Token has scope(s) ${joinedScopes} (needs 'api' and 'read_api').`,
            };
        }
        return { valid: true };
    }
    else {
        throw new Error(response.statusText);
    }
}, _GitLabAPI_hasValidScopes = function _GitLabAPI_hasValidScopes(scopes) {
    return scopes.includes('api') && scopes.includes('read_api');
}, _GitLabAPI_getGitLabInstanceVersion = async function _GitLabAPI_getGitLabInstanceVersion() {
    if (!__classPrivateFieldGet(this, _GitLabAPI_token, "f")) {
        throw 'Token needs to be provided';
    }
    const headers = __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, __classPrivateFieldGet(this, _GitLabAPI_token, "f"));
    const response = await (0, cross_fetch_1.default)(`${__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f")}/api/v4/version`, {
        headers,
    });
    const { version } = await response.json();
    return version;
}, _GitLabAPI_setCodeSuggestionsApiVersion = async function _GitLabAPI_setCodeSuggestionsApiVersion() {
    if (__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f").endsWith(exports.GITLAB_API_BASE_URL)) {
        __classPrivateFieldSet(this, _GitLabAPI_useNewApiVersion, true, "f");
        return;
    }
    try {
        const version = await __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getGitLabInstanceVersion).call(this);
        __classPrivateFieldSet(this, _GitLabAPI_useNewApiVersion, (0, semver_1.compare)(version, 'v16.3.0') >= 0, "f");
    }
    catch (err) {
        console.error(`Failed to get GitLab version: ${err}. Defaulting to the old API`);
    }
}, _GitLabAPI_getCodeSuggestionsV1 = async function _GitLabAPI_getCodeSuggestionsV1(requestData) {
    const completionToken = await __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getCompletionToken).call(this);
    const headers = {
        ...__classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, completionToken),
        'Content-Type': 'application/json',
        'X-Gitlab-Authentication-Type': 'oidc',
    };
    const response = await (0, cross_fetch_1.default)('https://codesuggestions.gitlab.com/v2/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
    });
    return response.json();
}, _GitLabAPI_getCodeSuggestionsV2 = async function _GitLabAPI_getCodeSuggestionsV2(requestData) {
    if (!__classPrivateFieldGet(this, _GitLabAPI_token, "f")) {
        throw 'Token needs to be provided';
    }
    const headers = {
        ...__classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, __classPrivateFieldGet(this, _GitLabAPI_token, "f")),
        'Content-Type': 'application/json',
    };
    const response = await (0, cross_fetch_1.default)(`${__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f")}/api/v4/code_suggestions/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
    });
    return response.json();
}, _GitLabAPI_getCompletionToken = async function _GitLabAPI_getCompletionToken() {
    // Check if token has expired
    if (__classPrivateFieldGet(this, _GitLabAPI_completionToken, "f")) {
        const unixTimestampNow = Math.floor(new Date().getTime() / 1000);
        if (unixTimestampNow < __classPrivateFieldGet(this, _GitLabAPI_completionToken, "f").created_at + __classPrivateFieldGet(this, _GitLabAPI_completionToken, "f").expires_in) {
            return __classPrivateFieldGet(this, _GitLabAPI_completionToken, "f").access_token;
        }
    }
    if (!__classPrivateFieldGet(this, _GitLabAPI_token, "f")) {
        throw 'Token needs to be provided';
    }
    const headers = __classPrivateFieldGet(this, _GitLabAPI_instances, "m", _GitLabAPI_getDefaultHeaders).call(this, __classPrivateFieldGet(this, _GitLabAPI_token, "f"));
    const response = await (0, cross_fetch_1.default)(`${__classPrivateFieldGet(this, _GitLabAPI_baseURL, "f")}/api/v4/code_suggestions/tokens`, {
        method: 'POST',
        headers,
    });
    __classPrivateFieldSet(this, _GitLabAPI_completionToken, (await response.json()), "f");
    return __classPrivateFieldGet(this, _GitLabAPI_completionToken, "f").access_token;
}, _GitLabAPI_getDefaultHeaders = function _GitLabAPI_getDefaultHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        'User-Agent': `code-completions-language-server-experiment (${__classPrivateFieldGet(this, _GitLabAPI_clientInfo, "f")?.name}:${__classPrivateFieldGet(this, _GitLabAPI_clientInfo, "f")?.version})`,
    };
};
//# sourceMappingURL=api.js.map