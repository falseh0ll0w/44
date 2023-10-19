"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/test-suite/util.test.ts
var import_mocha = require("mocha");
var import_assert = __toESM(require("assert"));

// src/util/util.ts
var os = require("os");
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
        insideString = false;
        newJson += doubleQuote;
      } else if (json[i] === singleQuote) {
        if (charIsEscapedAtIndex(i, json)) {
          newJson = newJson.slice(0, -1);
        }
        newJson += singleQuote;
      } else if (json[i] === doubleQuote) {
        if (!charIsEscapedAtIndex(i, json)) {
          newJson += "\\";
        }
        newJson += doubleQuote;
      } else {
        newJson += json[i];
      }
    } else {
      if (isQuote(json[i])) {
        insideString = true;
        enclosingQuoteType = json[i];
        newJson += doubleQuote;
      } else {
        newJson += json[i];
      }
    }
  }
  return newJson;
}

// src/test-suite/util.test.ts
(0, import_mocha.describe)("utils.ts", () => {
  (0, import_mocha.test)("convertSingleToDoubleQuoteJson", () => {
    let pairs = [
      [`{'a': 'b'}`, `{"a": "b"}`],
      [`{'a': "b", "c": 'd'}`, `{"a": "b", "c": "d"}`],
      [`{'a': '\\'"'}`, `{"a": "'\\""}`]
    ];
    for (let pair of pairs) {
      let result = convertSingleToDoubleQuoteJSON(pair[0]);
      (0, import_assert.default)(result === pair[1]);
      JSON.parse(result);
    }
  });
});
//# sourceMappingURL=util.test.js.map
