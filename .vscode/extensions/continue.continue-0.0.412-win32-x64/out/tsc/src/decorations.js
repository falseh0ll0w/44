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
exports.highlightCode = exports.showLintMessage = exports.showGutterSpinner = exports.decorationManager = exports.showAnswerInTextEditor = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const vscode_1 = require("./util/vscode");
function showAnswerInTextEditor(filename, range, answer) {
    vscode.workspace.openTextDocument((0, vscode_1.uriFromFilePath)(filename)).then((doc) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // Open file, reveal range, show decoration
        vscode.window.showTextDocument(doc).then((new_editor) => {
            new_editor.revealRange(new vscode.Range(range.end, range.end), vscode.TextEditorRevealType.InCenter);
            let decorationType = vscode.window.createTextEditorDecorationType({
                after: {
                    contentText: answer + "\n",
                    color: "rgb(0, 255, 0, 0.8)",
                },
                backgroundColor: "rgb(0, 255, 0, 0.2)",
            });
            new_editor.setDecorations(decorationType, [range]);
            vscode.window.showInformationMessage("Answer found!");
            // Remove decoration when user moves cursor
            vscode.window.onDidChangeTextEditorSelection((e) => {
                if (e.textEditor === new_editor &&
                    e.selections[0].active.line !== range.end.line) {
                    new_editor.setDecorations(decorationType, []);
                }
            });
        });
    });
}
exports.showAnswerInTextEditor = showAnswerInTextEditor;
class DecorationManager {
    constructor() {
        this.editorToDecorations = new Map();
        vscode.window.onDidChangeVisibleTextEditors((editors) => {
            for (const editor of editors) {
                if (editor.document.isClosed) {
                    this.editorToDecorations.delete(editor.document.uri.toString());
                }
            }
        });
    }
    rerenderDecorations(editorUri, decorationType) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const decorationTypes = this.editorToDecorations.get(editorUri);
        if (!decorationTypes) {
            return;
        }
        const decorations = decorationTypes.get(decorationType);
        if (!decorations) {
            return;
        }
        editor.setDecorations(decorationType, decorations);
    }
    addDecoration(key) {
        let decorationTypes = this.editorToDecorations.get(key.editorUri);
        if (!decorationTypes) {
            decorationTypes = new Map();
            decorationTypes.set(key.decorationType, [key.options]);
            this.editorToDecorations.set(key.editorUri, decorationTypes);
        }
        else {
            const decorations = decorationTypes.get(key.decorationType);
            if (!decorations) {
                decorationTypes.set(key.decorationType, [key.options]);
            }
            else {
                decorations.push(key.options);
            }
        }
        this.rerenderDecorations(key.editorUri, key.decorationType);
        vscode.window.onDidChangeTextEditorSelection((event) => {
            if (event.textEditor.document.fileName === key.editorUri) {
                this.deleteAllDecorations(key.editorUri);
            }
        });
    }
    deleteDecoration(key) {
        let decorationTypes = this.editorToDecorations.get(key.editorUri);
        if (!decorationTypes) {
            return;
        }
        let decorations = decorationTypes?.get(key.decorationType);
        if (!decorations) {
            return;
        }
        decorations = decorations.filter((decOpts) => decOpts !== key.options);
        decorationTypes.set(key.decorationType, decorations);
        this.rerenderDecorations(key.editorUri, key.decorationType);
    }
    deleteAllDecorations(editorUri) {
        let decorationTypes = this.editorToDecorations.get(editorUri)?.keys();
        if (!decorationTypes) {
            return;
        }
        this.editorToDecorations.delete(editorUri);
        for (let decorationType of decorationTypes) {
            this.rerenderDecorations(editorUri, decorationType);
        }
    }
}
exports.decorationManager = new DecorationManager();
function constructBaseKey(editor, lineno, decorationType) {
    return {
        editorUri: editor.document.uri.toString(),
        options: {
            range: new vscode.Range(lineno, 0, lineno, 0),
        },
        decorationType: decorationType || vscode.window.createTextEditorDecorationType({}),
    };
}
const gutterSpinnerDecorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: vscode.Uri.file(path.join(__dirname, "..", "media", "spinner.gif")),
    gutterIconSize: "contain",
});
function showGutterSpinner(editor, lineno) {
    const key = constructBaseKey(editor, lineno, gutterSpinnerDecorationType);
    exports.decorationManager.addDecoration(key);
    return key;
}
exports.showGutterSpinner = showGutterSpinner;
function showLintMessage(editor, lineno, msg) {
    const key = constructBaseKey(editor, lineno);
    key.decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            contentText: "Linting error",
            color: "rgb(255, 0, 0, 0.6)",
        },
        gutterIconPath: vscode.Uri.file(path.join(__dirname, "..", "media", "error.png")),
        gutterIconSize: "contain",
    });
    key.options.hoverMessage = msg;
    exports.decorationManager.addDecoration(key);
    return key;
}
exports.showLintMessage = showLintMessage;
function highlightCode(editor, range, removeOnClick = true) {
    const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgb(255, 255, 0, 0.1)",
    });
    const key = {
        editorUri: editor.document.uri.toString(),
        options: {
            range,
        },
        decorationType,
    };
    exports.decorationManager.addDecoration(key);
    if (removeOnClick) {
        vscode.window.onDidChangeTextEditorSelection((e) => {
            if (e.textEditor === editor) {
                exports.decorationManager.deleteDecoration(key);
            }
        });
    }
    return key;
}
exports.highlightCode = highlightCode;
//# sourceMappingURL=decorations.js.map