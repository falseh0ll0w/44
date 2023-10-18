"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaKeyLabel = exports.getPlatform = exports.debounced = exports.convertSingleToDoubleQuoteJSON = void 0;
const os = require("os");
function charIsEscapedAtIndex(index, str) {
    if (index === 0)
        return false;
    if (str[index - 1] !== "\\")
        return false;
    return !charIsEscapedAtIndex(index - 1, str);
}
function convertSingleToDoubleQuoteJSON(json) {
    const singleQuote = "'";
    const doubleQuote = '"';
    const isQuote = (char) => char === doubleQuote || char === singleQuote;
    let newJson = "";
    let insideString = false;
    let enclosingQuoteType = doubleQuote;
    for (let i = 0; i < json.length; i++) {
        if (insideString) {
            if (json[i] === enclosingQuoteType && !charIsEscapedAtIndex(i, json)) {
                // Close string with a double quote
                insideString = false;
                newJson += doubleQuote;
            }
            else if (json[i] === singleQuote) {
                if (charIsEscapedAtIndex(i, json)) {
                    // Unescape single quote
                    newJson = newJson.slice(0, -1);
                }
                newJson += singleQuote;
            }
            else if (json[i] === doubleQuote) {
                if (!charIsEscapedAtIndex(i, json)) {
                    // Escape double quote
                    newJson += "\\";
                }
                newJson += doubleQuote;
            }
            else {
                newJson += json[i];
            }
        }
        else {
            if (isQuote(json[i])) {
                insideString = true;
                enclosingQuoteType = json[i];
                newJson += doubleQuote;
            }
            else {
                newJson += json[i];
            }
        }
    }
    return newJson;
}
exports.convertSingleToDoubleQuoteJSON = convertSingleToDoubleQuoteJSON;
function debounced(delay, fn) {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };
}
exports.debounced = debounced;
function getPlatform() {
    const platform = os.platform();
    if (platform === "darwin") {
        return "mac";
    }
    else if (platform === "linux") {
        return "linux";
    }
    else if (platform === "win32") {
        return "windows";
    }
    else {
        return "unknown";
    }
}
exports.getPlatform = getPlatform;
function getMetaKeyLabel() {
    const platform = getPlatform();
    switch (platform) {
        case "mac":
            return "⌘";
        case "linux":
        case "windows":
            return "^";
        default:
            return "⌘";
    }
}
exports.getMetaKeyLabel = getMetaKeyLabel;
//# sourceMappingURL=util.js.map