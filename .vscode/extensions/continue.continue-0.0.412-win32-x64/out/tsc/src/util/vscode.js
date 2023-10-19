"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueId = exports.uriFromFilePath = exports.openEditorAndRevealRange = exports.getRightViewColumn = exports.getViewColumnOfFile = exports.getExtensionUri = exports.getNonce = exports.translate = void 0;
const vscode = __importStar(require("vscode"));
const node_machine_id_1 = require("node-machine-id");
function translate(range, lines) {
    return new vscode.Range(range.start.line + lines, range.start.character, range.end.line + lines, range.end.character);
}
exports.translate = translate;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;
function getExtensionUri() {
    return vscode.extensions.getExtension("Continue.continue").extensionUri;
}
exports.getExtensionUri = getExtensionUri;
function getViewColumnOfFile(filepath) {
    for (let tabGroup of vscode.window.tabGroups.all) {
        for (let tab of tabGroup.tabs) {
            if (tab?.input?.uri &&
                tab.input.uri.fsPath === filepath) {
                return tabGroup.viewColumn;
            }
        }
    }
    return undefined;
}
exports.getViewColumnOfFile = getViewColumnOfFile;
function getRightViewColumn() {
    // When you want to place in the rightmost panel if there is already more than one, otherwise use Beside
    let column = vscode.ViewColumn.Beside;
    let columnOrdering = [
        vscode.ViewColumn.One,
        vscode.ViewColumn.Beside,
        vscode.ViewColumn.Two,
        vscode.ViewColumn.Three,
        vscode.ViewColumn.Four,
        vscode.ViewColumn.Five,
        vscode.ViewColumn.Six,
        vscode.ViewColumn.Seven,
        vscode.ViewColumn.Eight,
        vscode.ViewColumn.Nine,
    ];
    for (let tabGroup of vscode.window.tabGroups.all) {
        if (columnOrdering.indexOf(tabGroup.viewColumn) >
            columnOrdering.indexOf(column)) {
            column = tabGroup.viewColumn;
        }
    }
    return column;
}
exports.getRightViewColumn = getRightViewColumn;
let showTextDocumentInProcess = false;
function openEditorAndRevealRange(editorFilename, range, viewColumn) {
    return new Promise((resolve, _) => {
        vscode.workspace.openTextDocument(editorFilename).then(async (doc) => {
            try {
                // An error is thrown mysteriously if you open two documents in parallel, hence this
                while (showTextDocumentInProcess) {
                    await new Promise((resolve) => {
                        setInterval(() => {
                            resolve(null);
                        }, 200);
                    });
                }
                showTextDocumentInProcess = true;
                vscode.window
                    .showTextDocument(doc, getViewColumnOfFile(editorFilename) || viewColumn)
                    .then((editor) => {
                    if (range) {
                        editor.revealRange(range);
                    }
                    resolve(editor);
                    showTextDocumentInProcess = false;
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    });
}
exports.openEditorAndRevealRange = openEditorAndRevealRange;
function windowsToPosix(windowsPath) {
    let posixPath = windowsPath.split("\\").join("/");
    if (posixPath[1] === ":") {
        posixPath = posixPath.slice(2);
    }
    posixPath = posixPath.replace(" ", "\\ ");
    return posixPath;
}
function uriFromFilePath(filepath) {
    if (vscode.env.remoteName) {
        if ((vscode.env.remoteName === "wsl" ||
            vscode.env.remoteName === "ssh-remote") &&
            process.platform === "win32") {
            filepath = windowsToPosix(filepath);
        }
        return vscode.Uri.parse(`vscode-remote://${vscode.env.remoteName}${filepath}`);
    }
    else {
        return vscode.Uri.file(filepath);
    }
}
exports.uriFromFilePath = uriFromFilePath;
function getUniqueId() {
    const id = vscode.env.machineId;
    if (id === "someValue.machineId") {
        return (0, node_machine_id_1.machineIdSync)();
    }
    return vscode.env.machineId;
}
exports.getUniqueId = getUniqueId;
//# sourceMappingURL=vscode.js.map