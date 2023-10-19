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
exports.registerAllCommands = exports.setFocusedOnContinueInput = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const diffs_1 = require("./diffs");
const debugPanel_1 = require("./debugPanel");
const activate_1 = require("./activation/activate");
let focusedOnContinueInput = false;
function addHighlightedCodeToContext(edit) {
    focusedOnContinueInput = !focusedOnContinueInput;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        if (selection.isEmpty)
            return;
        const range = new vscode.Range(selection.start, selection.end);
        const contents = editor.document.getText(range);
        activate_1.ideProtocolClient?.sendHighlightedCode([
            {
                filepath: editor.document.uri.fsPath,
                contents,
                range: {
                    start: {
                        line: selection.start.line,
                        character: selection.start.character,
                    },
                    end: {
                        line: selection.end.line,
                        character: selection.end.character,
                    },
                },
            },
        ], edit);
    }
}
const setFocusedOnContinueInput = (value) => {
    focusedOnContinueInput = value;
};
exports.setFocusedOnContinueInput = setFocusedOnContinueInput;
// Copy everything over from extension.ts
const commandsMap = {
    "continue.acceptDiff": diffs_1.acceptDiffCommand,
    "continue.rejectDiff": diffs_1.rejectDiffCommand,
    "continue.quickFix": async (message, code, edit) => {
        activate_1.ideProtocolClient.sendMainUserInput(`${edit ? "/edit " : ""}${code}\n\nHow do I fix this problem in the above code?: ${message}`);
        if (!edit) {
            vscode.commands.executeCommand("continue.continueGUIView.focus");
        }
    },
    "continue.focusContinueInput": async () => {
        vscode.commands.executeCommand("continue.continueGUIView.focus");
        debugPanel_1.debugPanelWebview?.postMessage({
            type: "focusContinueInput",
        });
        addHighlightedCodeToContext(false);
    },
    "continue.focusContinueInputWithEdit": async () => {
        vscode.commands.executeCommand("continue.continueGUIView.focus");
        addHighlightedCodeToContext(true);
        debugPanel_1.debugPanelWebview?.postMessage({
            type: "focusContinueInputWithEdit",
        });
        focusedOnContinueInput = true;
    },
    "continue.toggleAuxiliaryBar": () => {
        vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
    },
    "continue.quickTextEntry": async () => {
        addHighlightedCodeToContext(true);
        const text = await vscode.window.showInputBox({
            placeHolder: "Ask a question or enter a slash command",
            title: "Continue Quick Input",
        });
        if (text) {
            activate_1.ideProtocolClient.sendMainUserInput(text);
        }
    },
    "continue.viewLogs": async () => {
        // Open ~/.continue/continue.log
        const logFile = path.join(os.homedir(), ".continue", "continue.log");
        // Make sure the file/directory exist
        if (!fs.existsSync(logFile)) {
            fs.mkdirSync(path.dirname(logFile), { recursive: true });
            fs.writeFileSync(logFile, "");
        }
        const uri = vscode.Uri.file(logFile);
        await vscode.window.showTextDocument(uri);
    },
    "continue.debugTerminal": async () => {
        vscode.commands.executeCommand("continue.continueGUIView.focus");
        await activate_1.ideProtocolClient.debugTerminal();
    },
    // Commands without keyboard shortcuts
    "continue.addModel": () => {
        vscode.commands.executeCommand("continue.continueGUIView.focus");
        debugPanel_1.debugPanelWebview?.postMessage({
            type: "addModel",
        });
    },
    "continue.openSettingsUI": () => {
        vscode.commands.executeCommand("continue.continueGUIView.focus");
        debugPanel_1.debugPanelWebview?.postMessage({
            type: "openSettings",
        });
    },
};
function registerAllCommands(context) {
    for (const [command, callback] of Object.entries(commandsMap)) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }
}
exports.registerAllCommands = registerAllCommands;
//# sourceMappingURL=commands.js.map