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
exports.rejectDiffCommand = exports.acceptDiffCommand = exports.diffManager = exports.DIFF_DIRECTORY = void 0;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
const activate_1 = require("./activation/activate");
const util_1 = require("./util/util");
const environmentSetup_1 = require("./activation/environmentSetup");
const vscode_1 = require("./util/vscode");
async function readFile(path) {
    return await vscode.workspace.fs
        .readFile((0, vscode_1.uriFromFilePath)(path))
        .then((bytes) => new TextDecoder().decode(bytes));
}
async function writeFile(uri, contents) {
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(contents));
}
// THIS IS LOCAL
exports.DIFF_DIRECTORY = path
    .join(os.homedir(), ".continue", "diffs")
    .replace(/^C:/, "c:");
class DiffManager {
    diffAtNewFilepath(newFilepath) {
        return this.diffs.get(newFilepath);
    }
    async setupDirectory() {
        // Make sure the diff directory exists
        if (!fs.existsSync(exports.DIFF_DIRECTORY)) {
            fs.mkdirSync(exports.DIFF_DIRECTORY, {
                recursive: true,
            });
        }
    }
    constructor() {
        // Create a temporary file in the global .continue directory which displays the updated version
        // Doing this because virtual files are read-only
        this.diffs = new Map();
        this.remoteTmpDir = "/tmp/continue";
        this.setupDirectory();
        // Listen for file closes, and if it's a diff file, clean up
        vscode.workspace.onDidCloseTextDocument((document) => {
            const newFilepath = document.uri.fsPath;
            const diffInfo = this.diffs.get(newFilepath);
            if (diffInfo) {
                this.cleanUpDiff(diffInfo, false);
            }
        });
    }
    escapeFilepath(filepath) {
        return filepath.replace(/\//g, "$f$").replace(/\\/g, "$b$");
    }
    getNewFilepath(originalFilepath) {
        if (vscode.env.remoteName) {
            // If we're in a remote, use the remote's temp directory
            // Doing this because there's no easy way to find the home directory,
            // and there aren't write permissions to the root directory
            // and writing these to local causes separate issues
            // because the vscode.diff command will always try to read from remote
            vscode.workspace.fs.createDirectory((0, vscode_1.uriFromFilePath)(this.remoteTmpDir));
            return path.join(this.remoteTmpDir, this.escapeFilepath(originalFilepath));
        }
        return path.join(exports.DIFF_DIRECTORY, this.escapeFilepath(originalFilepath));
    }
    async openDiffEditor(originalFilepath, newFilepath) {
        // If the file doesn't yet exist or the basename is a single digit number (vscode terminal), don't open the diff editor
        try {
            await vscode.workspace.fs.stat((0, vscode_1.uriFromFilePath)(newFilepath));
        }
        catch (e) {
            console.log("File doesn't exist, not opening diff editor", e);
            return undefined;
        }
        if (path.basename(originalFilepath).match(/^\d$/)) {
            return undefined;
        }
        const rightUri = (0, vscode_1.uriFromFilePath)(newFilepath);
        const leftUri = (0, vscode_1.uriFromFilePath)(originalFilepath);
        const title = "Continue Diff";
        console.log("Opening diff window with ", leftUri, rightUri, title, newFilepath, originalFilepath);
        vscode.commands.executeCommand("vscode.diff", leftUri, rightUri, title);
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // Change the vscode setting to allow codeLens in diff editor
        vscode.workspace
            .getConfiguration("diffEditor", editor.document.uri)
            .update("codeLens", true, vscode.ConfigurationTarget.Global);
        if (activate_1.extensionContext?.globalState.get("continue.showDiffInfoMessage") !== false) {
            vscode.window
                .showInformationMessage(`Accept (${(0, util_1.getMetaKeyLabel)()}⇧↩) or reject (${(0, util_1.getMetaKeyLabel)()}⇧⌫) at the top of the file.`, "Got it", "Don't show again")
                .then((selection) => {
                if (selection === "Don't show again") {
                    // Get the global state
                    activate_1.extensionContext?.globalState.update("continue.showDiffInfoMessage", false);
                }
            });
        }
        return editor;
    }
    _findFirstDifferentLine(contentA, contentB) {
        const linesA = contentA.split("\n");
        const linesB = contentB.split("\n");
        for (let i = 0; i < linesA.length && i < linesB.length; i++) {
            if (linesA[i] !== linesB[i]) {
                return i;
            }
        }
        return 0;
    }
    async writeDiff(originalFilepath, newContent, step_index) {
        await this.setupDirectory();
        // Create or update existing diff
        const newFilepath = this.getNewFilepath(originalFilepath);
        await writeFile((0, vscode_1.uriFromFilePath)(newFilepath), newContent);
        // Open the diff editor if this is a new diff
        if (!this.diffs.has(newFilepath)) {
            // Figure out the first line that is different
            const oldContent = await readFile(originalFilepath);
            const line = this._findFirstDifferentLine(oldContent, newContent);
            const diffInfo = {
                originalFilepath,
                newFilepath,
                step_index,
                range: new vscode.Range(line, 0, line + 1, 0),
            };
            this.diffs.set(newFilepath, diffInfo);
        }
        // Open the editor if it hasn't been opened yet
        const diffInfo = this.diffs.get(newFilepath);
        if (diffInfo && !diffInfo?.editor) {
            diffInfo.editor = await this.openDiffEditor(originalFilepath, newFilepath);
            this.diffs.set(newFilepath, diffInfo);
        }
        if ((0, util_1.getPlatform)() === "windows") {
            // Just a matter of how it renders
            // Lags on windows without this
            // Flashes too much on mac with it
            vscode.commands.executeCommand("workbench.action.files.revert", (0, vscode_1.uriFromFilePath)(newFilepath));
        }
        return newFilepath;
    }
    cleanUpDiff(diffInfo, hideEditor = true) {
        // Close the editor, remove the record, delete the file
        if (hideEditor && diffInfo.editor) {
            try {
                vscode.window.showTextDocument(diffInfo.editor.document);
                vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            }
            catch { }
        }
        this.diffs.delete(diffInfo.newFilepath);
        vscode.workspace.fs.delete((0, vscode_1.uriFromFilePath)(diffInfo.newFilepath));
    }
    inferNewFilepath() {
        const activeEditorPath = vscode.window.activeTextEditor?.document.uri.fsPath;
        if (activeEditorPath && path.dirname(activeEditorPath) === exports.DIFF_DIRECTORY) {
            return activeEditorPath;
        }
        const visibleEditors = vscode.window.visibleTextEditors.map((editor) => editor.document.uri.fsPath);
        for (const editorPath of visibleEditors) {
            if (path.dirname(editorPath) === exports.DIFF_DIRECTORY) {
                for (const otherEditorPath of visibleEditors) {
                    if (path.dirname(otherEditorPath) !== exports.DIFF_DIRECTORY &&
                        this.getNewFilepath(otherEditorPath) === editorPath) {
                        return editorPath;
                    }
                }
            }
        }
        if (this.diffs.size === 1) {
            return Array.from(this.diffs.keys())[0];
        }
        return undefined;
    }
    async acceptDiff(newFilepath) {
        // When coming from a keyboard shortcut, we have to infer the newFilepath from visible text editors
        if (!newFilepath) {
            newFilepath = this.inferNewFilepath();
        }
        if (!newFilepath) {
            console.log("No newFilepath provided to accept the diff");
            return;
        }
        // Get the diff info, copy new file to original, then delete from record and close the corresponding editor
        const diffInfo = this.diffs.get(newFilepath);
        if (!diffInfo) {
            console.log("No corresponding diffInfo found for newFilepath");
            return;
        }
        // Save the right-side file, then copy over to original
        vscode.workspace.textDocuments
            .find((doc) => doc.uri.fsPath === newFilepath)
            ?.save()
            .then(async () => {
            await writeFile((0, vscode_1.uriFromFilePath)(diffInfo.originalFilepath), await readFile(diffInfo.newFilepath));
            this.cleanUpDiff(diffInfo);
        });
        await recordAcceptReject(true, diffInfo);
        activate_1.ideProtocolClient.sendAcceptRejectDiff(true, diffInfo.step_index);
    }
    async rejectDiff(newFilepath) {
        // If no newFilepath is provided and there is only one in the dictionary, use that
        if (!newFilepath) {
            newFilepath = this.inferNewFilepath();
        }
        if (!newFilepath) {
            console.log("No newFilepath provided to reject the diff, diffs.size was", this.diffs.size);
            return;
        }
        const diffInfo = this.diffs.get(newFilepath);
        if (!diffInfo) {
            console.log("No corresponding diffInfo found for newFilepath");
            return;
        }
        // Stop the step at step_index in case it is still streaming
        activate_1.ideProtocolClient.deleteAtIndex(diffInfo.step_index);
        vscode.workspace.textDocuments
            .find((doc) => doc.uri.fsPath === newFilepath)
            ?.save()
            .then(() => {
            this.cleanUpDiff(diffInfo);
        });
        await recordAcceptReject(false, diffInfo);
        activate_1.ideProtocolClient.sendAcceptRejectDiff(false, diffInfo.step_index);
    }
}
exports.diffManager = new DiffManager();
async function recordAcceptReject(accepted, diffInfo) {
    const devDataDir = (0, environmentSetup_1.devDataPath)();
    const suggestionsPath = path.join(devDataDir, "suggestions.json");
    // Initialize suggestions list
    let suggestions = [];
    // Check if suggestions.json exists
    try {
        const rawData = await readFile(suggestionsPath);
        suggestions = JSON.parse(rawData);
    }
    catch { }
    // Add the new suggestion to the list
    suggestions.push({
        accepted,
        timestamp: Date.now(),
        suggestion: diffInfo.originalFilepath,
    });
    // Send the suggestion to the server
    // ideProtocolClient.sendAcceptRejectSuggestion(accepted);
    // Write the updated suggestions back to the file
    await writeFile(vscode.Uri.file(suggestionsPath), JSON.stringify(suggestions, null, 4));
}
async function acceptDiffCommand(newFilepath) {
    await exports.diffManager.acceptDiff(newFilepath);
}
exports.acceptDiffCommand = acceptDiffCommand;
async function rejectDiffCommand(newFilepath) {
    await exports.diffManager.rejectDiff(newFilepath);
}
exports.rejectDiffCommand = rejectDiffCommand;
//# sourceMappingURL=diffs.js.map