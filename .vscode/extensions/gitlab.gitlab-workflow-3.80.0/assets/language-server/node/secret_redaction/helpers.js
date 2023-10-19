"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToJavaScriptRegex = void 0;
const convertToJavaScriptRegex = (pcreRegex) => {
    // Remove the (?i) flag (case-insensitive) if present
    const regexWithoutCaseInsensitiveFlag = pcreRegex.replace(/\(\?i\)/g, '');
    // Replace \x60 escape with a backtick
    const jsRegex = regexWithoutCaseInsensitiveFlag.replace(/\\x60/g, '`');
    return jsRegex;
};
exports.convertToJavaScriptRegex = convertToJavaScriptRegex;
//# sourceMappingURL=helpers.js.map