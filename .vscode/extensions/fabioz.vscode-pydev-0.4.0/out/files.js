"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextBasenameIn = exports.makeDirs = exports.writeToFile = exports.readFromFile = exports.uriExists = exports.fileExists = exports.verifyFileExists = exports.getExtensionRelativeFile = void 0;
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const channel_1 = require("./channel");
const path_1 = require("path");
/**
 * @param mustExist if true, if the returned file does NOT exist, returns undefined.
 */
function getExtensionRelativeFile(relativeLocation, mustExist = true) {
    let targetFile = path.resolve(__dirname, relativeLocation);
    if (mustExist) {
        if (!verifyFileExists(targetFile)) {
            return undefined;
        }
    }
    return targetFile;
}
exports.getExtensionRelativeFile = getExtensionRelativeFile;
function verifyFileExists(targetFile, warnUser = true) {
    if (!fs.existsSync(targetFile)) {
        let msg = "Error. Expected: " + targetFile + " to exist.";
        if (warnUser)
            vscode_1.window.showWarningMessage(msg);
        channel_1.OUTPUT_CHANNEL.appendLine(msg);
        return false;
    }
    return true;
}
exports.verifyFileExists = verifyFileExists;
function fileExists(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.promises.stat(filename);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
exports.fileExists = fileExists;
function uriExists(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield vscode_1.workspace.fs.stat(uri);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
exports.uriExists = uriExists;
function readFromFile(targetFile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fileExists(targetFile))) {
            return undefined;
        }
        const contents = yield fs.promises.readFile(targetFile);
        return contents.toString();
    });
}
exports.readFromFile = readFromFile;
function writeToFile(targetFile, content, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fs.promises.writeFile(targetFile, content, options);
    });
}
exports.writeToFile = writeToFile;
function makeDirs(targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.promises.mkdir(targetDir, { recursive: true });
    });
}
exports.makeDirs = makeDirs;
function findNextBasenameIn(folder, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const check = (0, path_1.join)(folder, prefix);
        if (!(yield fileExists(check))) {
            return prefix; // Use as is directly
        }
        for (let i = 1; i < 9999; i++) {
            const basename = `${prefix}-${i}`;
            const check = (0, path_1.join)(folder, basename);
            if (!(yield fileExists(check))) {
                return basename;
            }
        }
        throw new Error(`Unable to find valid name in ${folder} for prefix: ${prefix}.`);
    });
}
exports.findNextBasenameIn = findNextBasenameIn;
//# sourceMappingURL=files.js.map