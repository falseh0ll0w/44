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
exports.showSuggestion = exports.rejectSuggestionCommand = exports.rejectAllSuggestionsCommand = exports.acceptAllSuggestionsCommand = exports.acceptSuggestionCommand = exports.suggestionUpCommand = exports.suggestionDownCommand = exports.rerenderDecorations = exports.currentSuggestion = exports.editorSuggestionsLocked = exports.editorToSuggestions = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("./util/vscode");
const vscode_2 = require("./util/vscode");
const codeLens_1 = require("./lang-server/codeLens");
const activate_1 = require("./activation/activate");
/* Keyed by editor.document.uri.toString() */
exports.editorToSuggestions = new Map();
exports.editorSuggestionsLocked = new Map(); // Map from editor URI to whether the suggestions are locked
exports.currentSuggestion = new Map(); // Map from editor URI to index of current SuggestionRanges in editorToSuggestions
// When tab is reopened, rerender the decorations:
vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor)
        return;
    rerenderDecorations(editor.document.uri.toString());
});
vscode.workspace.onDidOpenTextDocument((doc) => {
    rerenderDecorations(doc.uri.toString());
});
const newDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgb(0, 255, 0, 0.1)",
    isWholeLine: true,
});
const oldDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgb(255, 0, 0, 0.1)",
    isWholeLine: true,
    cursor: "pointer",
});
const newSelDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgb(0, 255, 0, 0.25)",
    isWholeLine: true,
    // after: {
    //   contentText: "Press ctrl+shift+enter to accept",
    //   margin: "0 0 0 1em",
    // },
});
const oldSelDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: "rgb(255, 0, 0, 0.25)",
    isWholeLine: true,
    // after: {
    //   contentText: "Press ctrl+shift+enter to reject",
    //   margin: "0 0 0 1em",
    // },
});
function rerenderDecorations(editorUri) {
    const suggestions = exports.editorToSuggestions.get(editorUri);
    const idx = exports.currentSuggestion.get(editorUri);
    const editor = vscode.window.visibleTextEditors.find((editor) => editor.document.uri.toString() === editorUri);
    if (!suggestions || !editor)
        return;
    const rangesWithoutEmptyLastLine = (ranges) => {
        const newRanges = [];
        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            if (range.start.line === range.end.line &&
                range.start.character === 0 &&
                range.end.character === 0) {
                // Empty range, don't show it
                continue; // is great
            }
            newRanges.push(new vscode.Range(range.start.line, range.start.character, 
            // Don't include the last line if it is empty
            range.end.line - (range.end.character === 0 ? 1 : 0), range.end.character));
        }
        return newRanges;
    };
    let olds = [];
    let news = [];
    let oldSels = [];
    let newSels = [];
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        if (typeof idx != "undefined" && idx === i) {
            if (suggestion.newSelected) {
                olds.push(suggestion.oldRange);
                newSels.push(suggestion.newRange);
            }
            else {
                oldSels.push(suggestion.oldRange);
                news.push(suggestion.newRange);
            }
        }
        else {
            olds.push(suggestion.oldRange);
            news.push(suggestion.newRange);
        }
    }
    // Don't highlight the last line if it is empty
    olds = rangesWithoutEmptyLastLine(olds);
    news = rangesWithoutEmptyLastLine(news);
    oldSels = rangesWithoutEmptyLastLine(oldSels);
    newSels = rangesWithoutEmptyLastLine(newSels);
    editor.setDecorations(oldDecorationType, olds);
    editor.setDecorations(newDecorationType, news);
    editor.setDecorations(oldSelDecorationType, oldSels);
    editor.setDecorations(newSelDecorationType, newSels);
    // Reveal the range in the editor
    if (idx === undefined)
        return;
    editor.revealRange(suggestions[idx].newRange, vscode.TextEditorRevealType.Default);
    if (activate_1.extensionContext) {
        (0, codeLens_1.registerAllCodeLensProviders)(activate_1.extensionContext);
    }
}
exports.rerenderDecorations = rerenderDecorations;
function suggestionDownCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const editorUri = editor.document.uri.toString();
    const suggestions = exports.editorToSuggestions.get(editorUri);
    const idx = exports.currentSuggestion.get(editorUri);
    if (!suggestions || idx === undefined)
        return;
    const suggestion = suggestions[idx];
    if (!suggestion.newSelected) {
        suggestion.newSelected = true;
    }
    else if (idx + 1 < suggestions.length) {
        exports.currentSuggestion.set(editorUri, idx + 1);
    }
    else
        return;
    rerenderDecorations(editorUri);
}
exports.suggestionDownCommand = suggestionDownCommand;
function suggestionUpCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const editorUri = editor.document.uri.toString();
    const suggestions = exports.editorToSuggestions.get(editorUri);
    const idx = exports.currentSuggestion.get(editorUri);
    if (!suggestions || idx === undefined)
        return;
    const suggestion = suggestions[idx];
    if (suggestion.newSelected) {
        suggestion.newSelected = false;
    }
    else if (idx > 0) {
        exports.currentSuggestion.set(editorUri, idx - 1);
    }
    else
        return;
    rerenderDecorations(editorUri);
}
exports.suggestionUpCommand = suggestionUpCommand;
function selectSuggestion(accept, key = null) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const editorUri = editor.document.uri.toString();
    const suggestions = exports.editorToSuggestions.get(editorUri);
    if (!suggestions)
        return;
    let idx;
    if (key) {
        // Use the key to find a specific suggestion
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i].newRange === key.newRange &&
                suggestions[i].oldRange === key.oldRange) {
                // Don't include newSelected in the comparison, because it can change
                idx = i;
                break;
            }
        }
    }
    else {
        // Otherwise, use the current suggestion
        idx = exports.currentSuggestion.get(editorUri);
    }
    if (idx === undefined)
        return;
    let [suggestion] = suggestions.splice(idx, 1);
    var rangeToDelete;
    switch (accept) {
        case "old":
            rangeToDelete = suggestion.newRange;
            break;
        case "new":
            rangeToDelete = suggestion.oldRange;
            break;
        case "selected":
            rangeToDelete = suggestion.newSelected
                ? suggestion.oldRange
                : suggestion.newRange;
    }
    rangeToDelete = new vscode.Range(rangeToDelete.start, new vscode.Position(rangeToDelete.end.line, 0));
    editor.edit((edit) => {
        edit.delete(rangeToDelete);
    });
    // Shift the below suggestions up
    let linesToShift = rangeToDelete.end.line - rangeToDelete.start.line;
    for (let below of suggestions) {
        // Assumes there should be no crossover between suggestions. Might want to enforce this.
        if (below.oldRange.union(below.newRange).start.line >
            suggestion.oldRange.union(suggestion.newRange).start.line) {
            below.oldRange = (0, vscode_2.translate)(below.oldRange, -linesToShift);
            below.newRange = (0, vscode_2.translate)(below.newRange, -linesToShift);
        }
    }
    if (suggestions.length === 0) {
        exports.currentSuggestion.delete(editorUri);
    }
    else {
        exports.currentSuggestion.set(editorUri, Math.min(idx, suggestions.length - 1));
    }
    rerenderDecorations(editorUri);
    exports.editorToSuggestions.set(editorUri, suggestions);
}
function acceptSuggestionCommand(key = null) {
    selectSuggestion("selected", key);
}
exports.acceptSuggestionCommand = acceptSuggestionCommand;
function handleAllSuggestions(accept) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const editorUri = editor.document.uri.toString();
    const suggestions = exports.editorToSuggestions.get(editorUri);
    if (!suggestions)
        return;
    while (suggestions.length > 0) {
        selectSuggestion(accept ? "new" : "old", suggestions[0]);
    }
}
function acceptAllSuggestionsCommand() {
    handleAllSuggestions(true);
}
exports.acceptAllSuggestionsCommand = acceptAllSuggestionsCommand;
function rejectAllSuggestionsCommand() {
    handleAllSuggestions(false);
}
exports.rejectAllSuggestionsCommand = rejectAllSuggestionsCommand;
async function rejectSuggestionCommand(key = null) {
    selectSuggestion("old", key);
}
exports.rejectSuggestionCommand = rejectSuggestionCommand;
async function showSuggestion(editorFilename, range, suggestion) {
    // Check for empty suggestions:
    if (suggestion === "" &&
        range.start.line === range.end.line &&
        range.start.character === range.end.character) {
        return Promise.resolve(false);
    }
    const editor = await (0, vscode_1.openEditorAndRevealRange)(editorFilename, range);
    if (!editor)
        return Promise.resolve(false);
    return new Promise((resolve, reject) => {
        editor
            .edit((edit) => {
            edit.insert(new vscode.Position(range.end.line, 0), suggestion + (suggestion === "" ? "" : "\n"));
        }, { undoStopBefore: false, undoStopAfter: false })
            .then((success) => {
            if (success) {
                const suggestionLinesLength = suggestion === "" ? 0 : suggestion.split("\n").length;
                let suggestionRange = new vscode.Range(new vscode.Position(range.end.line, 0), new vscode.Position(range.end.line + suggestionLinesLength, 0));
                let content = editor.document.getText(suggestionRange);
                const filename = editor.document.uri.toString();
                if (exports.editorToSuggestions.has(filename)) {
                    let suggestions = exports.editorToSuggestions.get(filename);
                    suggestions.push({
                        oldRange: range,
                        newRange: suggestionRange,
                        newSelected: true,
                        newContent: content,
                    });
                    exports.editorToSuggestions.set(filename, suggestions);
                    exports.currentSuggestion.set(filename, suggestions.length - 1);
                }
                else {
                    exports.editorToSuggestions.set(filename, [
                        {
                            oldRange: range,
                            newRange: suggestionRange,
                            newSelected: true,
                            newContent: content,
                        },
                    ]);
                    exports.currentSuggestion.set(filename, 0);
                }
                rerenderDecorations(filename);
            }
            resolve(success);
        }, (reason) => reject(reason));
    });
}
exports.showSuggestion = showSuggestion;
//# sourceMappingURL=suggestions.js.map