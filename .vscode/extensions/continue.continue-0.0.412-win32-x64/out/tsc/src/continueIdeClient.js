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
const suggestions_1 = require("./suggestions");
const vscode_1 = require("./util/vscode");
const vscode = __importStar(require("vscode"));
const suggestions_2 = require("./suggestions");
const messenger_1 = require("./util/messenger");
const diffs_1 = require("./diffs");
const os = require("os");
const path = require("path");
const continueVirtualDocumentScheme = "continue";
class IdeProtocolClient {
    _newWebsocketMessenger() {
        const requestUrl = this._serverUrl + (this.sessionId ? `?session_id=${this.sessionId}` : "");
        const messenger = new messenger_1.WebsocketMessenger(requestUrl);
        this.messenger = messenger;
        const reconnect = () => {
            this.messenger = null;
            // Exponential backoff to reconnect
            this._reconnectionTimeouts.forEach((to) => clearTimeout(to));
            const timeout = setTimeout(() => {
                if (this.messenger?.websocket?.readyState === 1) {
                    return;
                }
                this._newWebsocketMessenger();
            }, this._lastReloadTime);
            this._reconnectionTimeouts.push(timeout);
            this._lastReloadTime = Math.min(2 * this._lastReloadTime, 5000);
        };
        messenger.onOpen(() => {
            this._reconnectionTimeouts.forEach((to) => clearTimeout(to));
        });
        messenger.onClose(() => {
            reconnect();
        });
        messenger.onError(() => {
            reconnect();
        });
        messenger.onMessage((messageType, data, messenger) => {
            this.handleMessage(messageType, data, messenger).catch((err) => {
                console.log("Error handling message: ", err);
                vscode.window
                    .showErrorMessage(`Error handling message (${messageType}) from Continue server: ` +
                    err, "View Logs")
                    .then((selection) => {
                    if (selection === "View Logs") {
                        vscode.commands.executeCommand("continue.viewLogs");
                    }
                });
            });
        });
    }
    constructor(serverUrl, context) {
        this.messenger = null;
        this._makingEdit = 0;
        this._highlightDebounce = null;
        this._lastReloadTime = 16;
        this._reconnectionTimeouts = [];
        this.sessionId = null;
        this.visibleMessages = new Set();
        // ------------------------------------ //
        // On message handlers
        this._lastDecorationType = null;
        this.context = context;
        this._serverUrl = serverUrl;
        this._newWebsocketMessenger();
        // Setup listeners for any file changes in open editors
        // vscode.workspace.onDidChangeTextDocument((event) => {
        //   if (this._makingEdit === 0) {
        //     let fileEdits: FileEditWithFullContents[] = event.contentChanges.map(
        //       (change) => {
        //         return {
        //           fileEdit: {
        //             filepath: event.document.uri.fsPath,
        //             range: {
        //               start: {
        //                 line: change.range.start.line,
        //                 character: change.range.start.character,
        //               },
        //               end: {
        //                 line: change.range.end.line,
        //                 character: change.range.end.character,
        //               },
        //             },
        //             replacement: change.text,
        //           },
        //           fileContents: event.document.getText(),
        //         };
        //       }
        //     );
        //     this.messenger?.send("fileEdits", { fileEdits });
        //   } else {
        //     this._makingEdit--;
        //   }
        // });
        // Listen for new file creation
        vscode.workspace.onDidCreateFiles((event) => {
            const filepaths = event.files.map((file) => file.fsPath);
            this.messenger?.send("filesCreated", { filepaths });
        });
        // Listen for file deletion
        vscode.workspace.onDidDeleteFiles((event) => {
            const filepaths = event.files.map((file) => file.fsPath);
            this.messenger?.send("filesDeleted", { filepaths });
        });
        // Listen for file renaming
        vscode.workspace.onDidRenameFiles((event) => {
            const oldFilepaths = event.files.map((file) => file.oldUri.fsPath);
            const newFilepaths = event.files.map((file) => file.newUri.fsPath);
            this.messenger?.send("filesRenamed", {
                old_filepaths: oldFilepaths,
                new_filepaths: newFilepaths,
            });
        });
        // Listen for file saving
        vscode.workspace.onDidSaveTextDocument((event) => {
            const filepath = event.uri.fsPath;
            const contents = event.getText();
            this.messenger?.send("fileSaved", { filepath, contents });
        });
        // Setup listeners for any selection changes in open editors
        // vscode.window.onDidChangeTextEditorSelection((event) => {
        //   if (!this.editorIsCode(event.textEditor)) {
        //     return;
        //   }
        //   if (this._highlightDebounce) {
        //     clearTimeout(this._highlightDebounce);
        //   }
        //   this._highlightDebounce = setTimeout(() => {
        //     const highlightedCode = event.textEditor.selections
        //       .filter((s) => !s.isEmpty)
        //       .map((selection) => {
        //         const range = new vscode.Range(selection.start, selection.end);
        //         const contents = event.textEditor.document.getText(range);
        //         return {
        //           filepath: event.textEditor.document.uri.fsPath,
        //           contents,
        //           range: {
        //             start: {
        //               line: selection.start.line,
        //               character: selection.start.character,
        //             },
        //             end: {
        //               line: selection.end.line,
        //               character: selection.end.character,
        //             },
        //           },
        //         };
        //       });
        //     this.sendHighlightedCode(highlightedCode);
        //   }, 100);
        // });
        // Register a content provider for the readonly virtual documents
        const documentContentProvider = new (class {
            constructor() {
                // emitter and its event
                this.onDidChangeEmitter = new vscode.EventEmitter();
                this.onDidChange = this.onDidChangeEmitter.event;
            }
            provideTextDocumentContent(uri) {
                return uri.query;
            }
        })();
        context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(continueVirtualDocumentScheme, documentContentProvider));
        // Listen for changes to settings.json
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("continue")) {
                vscode.window
                    .showInformationMessage("Please reload VS Code for changes to Continue settings to take effect.", "Reload")
                    .then((selection) => {
                    if (selection === "Reload") {
                        vscode.commands.executeCommand("workbench.action.reloadWindow");
                    }
                });
            }
        });
    }
    async handleMessage(messageType, data, messenger) {
        switch (messageType) {
            case "highlightedCode":
                messenger.send("highlightedCode", {
                    highlightedCode: this.getHighlightedCode(),
                });
                break;
            case "workspaceDirectory":
                messenger.send("workspaceDirectory", {
                    workspaceDirectory: this.getWorkspaceDirectory(),
                });
                break;
            case "uniqueId":
                messenger.send("uniqueId", {
                    uniqueId: this.getUniqueId(),
                });
                break;
            case "ide":
                messenger.send("ide", {
                    name: "vscode",
                    version: vscode.version,
                    remoteName: vscode.env.remoteName,
                });
                break;
            case "fileExists":
                messenger.send("fileExists", {
                    exists: await this.fileExists(data.filepath),
                });
                break;
            case "getUserSecret":
                messenger.send("getUserSecret", {
                    value: await this.getUserSecret(data.key),
                });
                break;
            case "openFiles":
                messenger.send("openFiles", {
                    openFiles: this.getOpenFiles(),
                });
                break;
            case "visibleFiles":
                messenger.send("visibleFiles", {
                    visibleFiles: this.getVisibleFiles(),
                });
                break;
            case "readFile":
                messenger.send("readFile", {
                    contents: await this.readFile(data.filepath),
                });
                break;
            case "getTerminalContents":
                messenger.send("getTerminalContents", {
                    contents: await this.getTerminalContents(data.commands),
                });
                break;
            case "listDirectoryContents":
                let contents = [];
                try {
                    contents = await this.getDirectoryContents(data.directory, data.recursive || false);
                }
                catch (e) {
                    console.log("Error listing directory contents: ", e);
                    contents = [];
                }
                messenger.send("listDirectoryContents", {
                    contents,
                });
                break;
            case "editFile":
                const fileEdit = await this.editFile(data.edit);
                messenger.send("editFile", {
                    fileEdit,
                });
                break;
            case "highlightCode":
                this.highlightCode(data.rangeInFile, data.color);
                break;
            case "runCommand":
                messenger.send("runCommand", {
                    output: await this.runCommand(data.command),
                });
                break;
            case "saveFile":
                this.saveFile(data.filepath);
                break;
            case "setFileOpen":
                this.openFile(data.filepath);
                // TODO: Close file if False
                break;
            case "showMessage":
                if (!this.visibleMessages.has(data.message)) {
                    this.visibleMessages.add(data.message);
                    vscode.window
                        .showInformationMessage(data.message, "Copy Traceback", "View Logs")
                        .then((selection) => {
                        if (selection === "View Logs") {
                            vscode.commands.executeCommand("continue.viewLogs");
                        }
                        else if (selection === "Copy Traceback") {
                            vscode.env.clipboard.writeText(data.message);
                        }
                    });
                }
                break;
            case "showVirtualFile":
                this.showVirtualFile(data.name, data.contents);
                break;
            case "setSuggestionsLocked":
                this.setSuggestionsLocked(data.filepath, data.locked);
                break;
            case "showSuggestion":
                this.showSuggestion(data.edit);
                break;
            case "showDiff":
                await this.showDiff(data.filepath, data.replacement, data.step_index);
                break;
            case "getSessionId":
            case "connected":
                break;
            default:
                throw Error("Unknown message type:" + messageType);
        }
    }
    getWorkspaceDirectory() {
        if (!vscode.workspace.workspaceFolders) {
            // Return the home directory
            return os.homedir();
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    getUniqueId() {
        return (0, vscode_1.getUniqueId)();
    }
    async highlightCode(rangeInFile, color) {
        const range = new vscode.Range(rangeInFile.range.start.line, rangeInFile.range.start.character, rangeInFile.range.end.line, rangeInFile.range.end.character);
        const editor = await (0, vscode_1.openEditorAndRevealRange)(rangeInFile.filepath, range, vscode.ViewColumn.One);
        if (editor) {
            const decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: color,
                isWholeLine: true,
            });
            editor.setDecorations(decorationType, [range]);
            const cursorDisposable = vscode.window.onDidChangeTextEditorSelection((event) => {
                if (event.textEditor.document.uri.fsPath === rangeInFile.filepath) {
                    cursorDisposable.dispose();
                    editor.setDecorations(decorationType, []);
                }
            });
            setTimeout(() => {
                cursorDisposable.dispose();
                editor.setDecorations(decorationType, []);
            }, 2500);
            if (this._lastDecorationType) {
                editor.setDecorations(this._lastDecorationType, []);
            }
            this._lastDecorationType = decorationType;
        }
    }
    showSuggestion(edit) {
        // showSuggestion already exists
        (0, suggestions_1.showSuggestion)(edit.filepath, new vscode.Range(edit.range.start.line, edit.range.start.character, edit.range.end.line, edit.range.end.character), edit.replacement);
    }
    async showDiff(filepath, replacement, step_index) {
        await diffs_1.diffManager.writeDiff(filepath, replacement, step_index);
    }
    openFile(filepath) {
        // vscode has a builtin open/get open files
        (0, vscode_1.openEditorAndRevealRange)(filepath, undefined, vscode.ViewColumn.One);
    }
    async fileExists(filepath) {
        try {
            await vscode.workspace.fs.stat((0, vscode_1.uriFromFilePath)(filepath));
            return true;
        }
        catch {
            return false;
        }
    }
    showVirtualFile(name, contents) {
        vscode.workspace
            .openTextDocument(vscode.Uri.parse(`${continueVirtualDocumentScheme}:${name}?${encodeURIComponent(contents)}`))
            .then((doc) => {
            vscode.window.showTextDocument(doc, { preview: false });
        });
    }
    setSuggestionsLocked(filepath, locked) {
        suggestions_1.editorSuggestionsLocked.set(filepath, locked);
        // TODO: Rerender?
    }
    async getUserSecret(key) {
        // Check if secret already exists in VS Code settings (global)
        let secret = vscode.workspace.getConfiguration("continue").get(key);
        if (typeof secret !== "undefined" && secret !== null) {
            return secret;
        }
        // If not, ask user for secret
        secret = await vscode.window.showInputBox({
            prompt: `Either enter secret for ${key} or press enter to try Continue for free.`,
            password: true,
        });
        // Add secret to VS Code settings
        vscode.workspace
            .getConfiguration("continue")
            .update(key, secret, vscode.ConfigurationTarget.Global);
        return secret;
    }
    // ------------------------------------ //
    // Initiate Request
    async getSessionId() {
        await new Promise((resolve, reject) => {
            // Repeatedly try to connect to the server
            const interval = setInterval(() => {
                if (this.messenger &&
                    this.messenger.websocket.readyState === 1 // 1 => OPEN
                ) {
                    clearInterval(interval);
                    resolve(null);
                }
                else {
                    // console.log("Websocket not yet open, trying again...");
                }
            }, 1000);
        });
        console.log("Getting session ID");
        const resp = await this.messenger?.sendAndReceive("getSessionId", {});
        console.log("New Continue session with ID: ", resp.sessionId);
        this.sessionId = resp.sessionId;
        return resp.sessionId;
    }
    acceptRejectSuggestion(accept, key) {
        if (accept) {
            (0, suggestions_2.acceptSuggestionCommand)(key);
        }
        else {
            (0, suggestions_2.rejectSuggestionCommand)(key);
        }
    }
    // ------------------------------------ //
    // Respond to request
    // Checks to see if the editor is a code editor.
    // In some cases vscode.window.visibleTextEditors can return non-code editors
    // e.g. terminal editors in side-by-side mode
    editorIsCode(editor) {
        return !(editor.document.languageId === "plaintext" &&
            editor.document.getText() === "accessible-buffer-accessible-buffer-");
    }
    getOpenFiles() {
        return vscode.window.visibleTextEditors
            .filter((editor) => this.editorIsCode(editor))
            .map((editor) => {
            return editor.document.uri.fsPath;
        });
    }
    getVisibleFiles() {
        return vscode.window.visibleTextEditors
            .filter((editor) => this.editorIsCode(editor))
            .map((editor) => {
            return editor.document.uri.fsPath;
        });
    }
    saveFile(filepath) {
        vscode.window.visibleTextEditors
            .filter((editor) => this.editorIsCode(editor))
            .forEach((editor) => {
            if (editor.document.uri.fsPath === filepath) {
                editor.document.save();
            }
        });
    }
    async getDirectoryContents(directory, recursive) {
        const nameAndType = (await vscode.workspace.fs.readDirectory((0, vscode_1.uriFromFilePath)(directory))).filter(([name, type]) => {
            const DEFAULT_IGNORE_DIRS = [
                ".git",
                ".vscode",
                ".idea",
                ".vs",
                ".venv",
                "env",
                ".env",
                "node_modules",
                "dist",
                "build",
                "target",
                "out",
                "bin",
                ".pytest_cache",
                ".vscode-test",
                ".continue",
                "__pycache__",
            ];
            if (!DEFAULT_IGNORE_DIRS.some((dir) => name.split(path.sep).includes(dir))) {
                return name;
            }
        });
        let absolutePaths = nameAndType
            .filter(([name, type]) => type === vscode.FileType.File)
            .map(([name, type]) => path.join(directory, name));
        if (recursive) {
            for (const [name, type] of nameAndType) {
                if (type === vscode.FileType.Directory) {
                    const subdirectory = path.join(directory, name);
                    const subdirectoryContents = await this.getDirectoryContents(subdirectory, recursive);
                    absolutePaths = absolutePaths.concat(subdirectoryContents);
                }
            }
        }
        return absolutePaths;
    }
    async readFile(filepath) {
        let contents;
        if (typeof contents === "undefined") {
            try {
                const fileStats = await vscode.workspace.fs.stat((0, vscode_1.uriFromFilePath)(filepath));
                if (fileStats.size > 1000000) {
                    return "";
                }
                contents = await vscode.workspace.fs
                    .readFile((0, vscode_1.uriFromFilePath)(filepath))
                    .then((bytes) => new TextDecoder().decode(bytes));
            }
            catch {
                contents = "";
            }
        }
        return contents;
    }
    async getTerminalContents(commands = -1) {
        const tempCopyBuffer = await vscode.env.clipboard.readText();
        if (commands < 0) {
            await vscode.commands.executeCommand("workbench.action.terminal.selectAll");
        }
        else {
            for (let i = 0; i < commands; i++) {
                await vscode.commands.executeCommand("workbench.action.terminal.selectToPreviousCommand");
            }
        }
        await vscode.commands.executeCommand("workbench.action.terminal.copySelection");
        await vscode.commands.executeCommand("workbench.action.terminal.clearSelection");
        const terminalContents = await vscode.env.clipboard.readText();
        await vscode.env.clipboard.writeText(tempCopyBuffer);
        if (tempCopyBuffer === terminalContents) {
            // This means there is no terminal open to select text from
            return "";
        }
        return terminalContents;
    }
    editFile(edit) {
        return new Promise((resolve, reject) => {
            (0, vscode_1.openEditorAndRevealRange)(edit.filepath, undefined, vscode.ViewColumn.One).then((editor) => {
                const range = new vscode.Range(edit.range.start.line, edit.range.start.character, edit.range.end.line, edit.range.end.character);
                editor.edit((editBuilder) => {
                    this._makingEdit += 2; // editBuilder.replace takes 2 edits: delete and insert
                    editBuilder.replace(range, edit.replacement);
                    resolve({
                        fileEdit: edit,
                        fileContents: editor.document.getText(),
                    });
                });
            });
        });
    }
    getHighlightedCode() {
        // TODO
        let rangeInFiles = [];
        vscode.window.visibleTextEditors
            .filter((editor) => this.editorIsCode(editor))
            .forEach((editor) => {
            editor.selections.forEach((selection) => {
                // if (!selection.isEmpty) {
                rangeInFiles.push({
                    filepath: editor.document.uri.fsPath,
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
                });
                // }
            });
        });
        return rangeInFiles;
    }
    async runCommand(command) {
        if (vscode.window.terminals.length) {
            vscode.window.terminals[0].sendText(command, false);
        }
        else {
            const terminal = vscode.window.createTerminal();
            terminal.show();
            terminal.sendText(command, false);
        }
    }
    sendCommandOutput(output) {
        this.messenger?.send("commandOutput", { output });
    }
    sendHighlightedCode(highlightedCode, edit) {
        this.messenger?.send("highlightedCodePush", { highlightedCode, edit });
    }
    sendAcceptRejectSuggestion(accepted) {
        this.messenger?.send("acceptRejectSuggestion", { accepted });
    }
    sendAcceptRejectDiff(accepted, stepIndex) {
        this.messenger?.send("acceptRejectDiff", { accepted, stepIndex });
    }
    sendMainUserInput(input) {
        this.messenger?.send("mainUserInput", { input });
    }
    async debugTerminal() {
        const contents = await this.getTerminalContents();
        this.messenger?.send("debugTerminal", { contents });
    }
    deleteAtIndex(index) {
        this.messenger?.send("deleteAtIndex", { index });
    }
}
exports.default = IdeProtocolClient;
//# sourceMappingURL=continueIdeClient.js.map