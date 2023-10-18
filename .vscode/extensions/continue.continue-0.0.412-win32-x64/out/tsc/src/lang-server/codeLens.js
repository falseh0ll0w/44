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
exports.registerAllCodeLensProviders = void 0;
const vscode = __importStar(require("vscode"));
const suggestions_1 = require("../suggestions");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const diffs_1 = require("../diffs");
const util_1 = require("../util/util");
class SuggestionsCodeLensProvider {
    provideCodeLenses(document, _) {
        const suggestions = suggestions_1.editorToSuggestions.get(document.uri.toString());
        if (!suggestions) {
            return [];
        }
        const locked = suggestions_1.editorSuggestionsLocked.get(document.uri.fsPath.toString());
        const codeLenses = [];
        for (const suggestion of suggestions) {
            const range = new vscode.Range(suggestion.oldRange.start, suggestion.newRange.end);
            codeLenses.push(new vscode.CodeLens(range, {
                title: "Accept ✅",
                command: "continue.acceptSuggestion",
                arguments: [suggestion],
            }), new vscode.CodeLens(range, {
                title: "Reject ❌",
                command: "continue.rejectSuggestion",
                arguments: [suggestion],
            }));
            if (codeLenses.length === 2) {
                codeLenses.push(new vscode.CodeLens(range, {
                    title: `(${(0, util_1.getMetaKeyLabel)()}⇧↩/${(0, util_1.getMetaKeyLabel)()}⇧⌫ to accept/reject all)`,
                    command: "",
                }));
            }
        }
        return codeLenses;
    }
}
class DiffViewerCodeLensProvider {
    provideCodeLenses(document, _) {
        if (path.dirname(document.uri.fsPath) === diffs_1.DIFF_DIRECTORY) {
            const codeLenses = [];
            let range = new vscode.Range(0, 0, 1, 0);
            const diffInfo = diffs_1.diffManager.diffAtNewFilepath(document.uri.fsPath);
            if (diffInfo) {
                range = diffInfo.range;
            }
            codeLenses.push(new vscode.CodeLens(range, {
                title: `Accept All ✅ (${(0, util_1.getMetaKeyLabel)()}⇧↩)`,
                command: "continue.acceptDiff",
                arguments: [document.uri.fsPath],
            }), new vscode.CodeLens(range, {
                title: `Reject All ❌ (${(0, util_1.getMetaKeyLabel)()}⇧⌫)`,
                command: "continue.rejectDiff",
                arguments: [document.uri.fsPath],
            }), new vscode.CodeLens(range, {
                title: `Further Edit ✏️ (${(0, util_1.getMetaKeyLabel)()}⇧M)`,
                command: "continue.focusContinueInputWithEdit",
            }));
            return codeLenses;
        }
        else {
            return [];
        }
    }
}
class ConfigPyCodeLensProvider {
    provideCodeLenses(document, _) {
        const codeLenses = [];
        if (!document.uri.fsPath.endsWith(".continue/config.py") &&
            !document.uri.fsPath.endsWith(".continue\\config.py")) {
            return codeLenses;
        }
        const lines = document.getText().split(os.EOL);
        const lineOfModels = lines.findIndex((line) => line.includes("models=Models("));
        if (lineOfModels >= 0) {
            const range = new vscode.Range(lineOfModels, 0, lineOfModels + 1, 0);
            codeLenses.push(new vscode.CodeLens(range, {
                title: `+ Add a Model`,
                command: "continue.addModel",
            }));
        }
        const lineOfSystemMessage = lines.findIndex((line) => line.replace(" ", "").includes("config=ContinueConfig("));
        if (lineOfSystemMessage >= 0) {
            const range = new vscode.Range(lineOfSystemMessage, 0, lineOfSystemMessage + 1, 0);
            codeLenses.push(new vscode.CodeLens(range, {
                title: `✏️ Edit in UI`,
                command: "continue.openSettingsUI",
            }));
        }
        return codeLenses;
    }
}
let diffsCodeLensDisposable = undefined;
let suggestionsCodeLensDisposable = undefined;
let configPyCodeLensDisposable = undefined;
function registerAllCodeLensProviders(context) {
    if (suggestionsCodeLensDisposable) {
        suggestionsCodeLensDisposable.dispose();
    }
    if (diffsCodeLensDisposable) {
        diffsCodeLensDisposable.dispose();
    }
    if (configPyCodeLensDisposable) {
        configPyCodeLensDisposable.dispose();
    }
    suggestionsCodeLensDisposable = vscode.languages.registerCodeLensProvider("*", new SuggestionsCodeLensProvider());
    diffsCodeLensDisposable = vscode.languages.registerCodeLensProvider("*", new DiffViewerCodeLensProvider());
    configPyCodeLensDisposable = vscode.languages.registerCodeLensProvider("*", new ConfigPyCodeLensProvider());
    context.subscriptions.push(suggestionsCodeLensDisposable);
    context.subscriptions.push(diffsCodeLensDisposable);
    context.subscriptions.push(configPyCodeLensDisposable);
}
exports.registerAllCodeLensProviders = registerAllCodeLensProviders;
//# sourceMappingURL=codeLens.js.map