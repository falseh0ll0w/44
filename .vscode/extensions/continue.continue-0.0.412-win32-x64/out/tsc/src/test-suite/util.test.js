"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const util_1 = require("../util/util");
(0, mocha_1.describe)("utils.ts", () => {
    (0, mocha_1.test)("convertSingleToDoubleQuoteJson", () => {
        let pairs = [
            [`{'a': 'b'}`, `{"a": "b"}`],
            [`{'a': "b", "c": 'd'}`, `{"a": "b", "c": "d"}`],
            [`{'a': '\\'"'}`, `{"a": "'\\""}`],
        ];
        for (let pair of pairs) {
            let result = (0, util_1.convertSingleToDoubleQuoteJSON)(pair[0]);
            (0, assert_1.default)(result === pair[1]);
            JSON.parse(result);
        }
    });
});
//# sourceMappingURL=util.test.js.map