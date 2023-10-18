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
exports.ContinueGUIWebviewViewProvider = exports.setupDebugPanel = exports.debugPanelWebview = void 0;
const vscode = __importStar(require("vscode"));
const bridge_1 = require("./bridge");
const vscode_1 = require("./util/vscode");
const commands_1 = require("./commands");
const WebSocket = require("ws");
let websocketConnections = {};
class WebsocketConnection {
    constructor(url, onMessage, onOpen, onClose, onError) {
        this._ws = new WebSocket(url);
        this._onMessage = onMessage;
        this._onOpen = onOpen;
        this._onClose = onClose;
        this._onError = onError;
        this._ws.addEventListener("message", (event) => {
            this._onMessage(event.data);
        });
        this._ws.addEventListener("close", () => {
            this._onClose();
        });
        this._ws.addEventListener("open", () => {
            this._onOpen();
        });
        this._ws.addEventListener("error", (e) => {
            this._onError(e);
        });
    }
    send(message) {
        if (typeof message !== "string") {
            message = JSON.stringify(message);
        }
        if (this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(message);
        }
        else {
            this._ws.addEventListener("open", () => {
                this._ws.send(message);
            });
        }
    }
    close() {
        this._ws.close();
    }
}
function setupDebugPanel(panel, sessionIdPromise) {
    exports.debugPanelWebview = panel.webview;
    panel.onDidDispose(() => {
        exports.debugPanelWebview = undefined;
    });
    let extensionUri = (0, vscode_1.getExtensionUri)();
    let scriptUri;
    let styleMainUri;
    let vscMediaUrl = exports.debugPanelWebview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "react-app/dist"))
        .toString();
    const isProduction = true; // context?.extensionMode === vscode.ExtensionMode.Development;
    if (isProduction) {
        scriptUri = exports.debugPanelWebview
            .asWebviewUri(vscode.Uri.joinPath(extensionUri, "react-app/dist/assets/index.js"))
            .toString();
        styleMainUri = exports.debugPanelWebview
            .asWebviewUri(vscode.Uri.joinPath(extensionUri, "react-app/dist/assets/index.css"))
            .toString();
    }
    else {
        scriptUri = "http://localhost:5173/src/main.tsx";
        styleMainUri = "http://localhost:5173/src/main.css";
    }
    panel.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "react-app/dist")],
        enableCommandUris: true,
    };
    const nonce = (0, vscode_1.getNonce)();
    vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.selections[0].isEmpty) {
            return;
        }
        const rangeInFile = {
            range: e.selections[0],
            filepath: e.textEditor.document.fileName,
        };
        const filesystem = {
            [rangeInFile.filepath]: e.textEditor.document.getText(),
        };
        panel.webview.postMessage({
            type: "highlightedCode",
            rangeInFile,
            filesystem,
        });
        panel.webview.postMessage({
            type: "workspacePath",
            value: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
        });
    });
    async function connectWebsocket(url) {
        return new Promise((resolve, reject) => {
            const onMessage = (message) => {
                panel.webview.postMessage({
                    type: "websocketForwardingMessage",
                    url,
                    data: message,
                });
            };
            const onOpen = () => {
                panel.webview.postMessage({
                    type: "websocketForwardingOpen",
                    url,
                });
                resolve(null);
            };
            const onClose = () => {
                websocketConnections[url] = undefined;
                panel.webview.postMessage({
                    type: "websocketForwardingClose",
                    url,
                });
            };
            const onError = (e) => {
                panel.webview.postMessage({
                    type: "websocketForwardingError",
                    url,
                    error: e,
                });
            };
            try {
                const connection = new WebsocketConnection(url, onMessage, onOpen, onClose, onError);
                websocketConnections[url] = connection;
                resolve(null);
            }
            catch (e) {
                console.log("Caught it!: ", e);
                reject(e);
            }
        });
    }
    panel.webview.onDidReceiveMessage(async (data) => {
        switch (data.type) {
            case "onLoad": {
                const sessionId = await sessionIdPromise;
                panel.webview.postMessage({
                    type: "onLoad",
                    vscMachineId: (0, vscode_1.getUniqueId)(),
                    apiUrl: (0, bridge_1.getContinueServerUrl)(),
                    workspacePaths: vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath),
                    sessionId,
                    vscMediaUrl,
                    dataSwitchOn: vscode.workspace
                        .getConfiguration("continue")
                        .get("dataSwitch"),
                });
                break;
            }
            case "toggleDataSwitch": {
                // Set the setting in vscode
                await vscode.workspace
                    .getConfiguration("continue")
                    .update("dataSwitch", data.on, vscode.ConfigurationTarget.Global);
                break;
            }
            case "websocketForwardingOpen": {
                let url = data.url;
                if (typeof websocketConnections[url] === "undefined") {
                    await connectWebsocket(url);
                }
                else {
                    console.log("Websocket connection requested by GUI already open at", url);
                    panel.webview.postMessage({
                        type: "websocketForwardingOpen",
                        url,
                    });
                }
                break;
            }
            case "websocketForwardingClose": {
                let url = data.url;
                let connection = websocketConnections[url];
                if (typeof connection !== "undefined") {
                    connection.close();
                    websocketConnections[url] = undefined;
                }
                break;
            }
            case "websocketForwardingMessage": {
                let url = data.url;
                let connection = websocketConnections[url];
                if (typeof connection === "undefined") {
                    await connectWebsocket(url);
                }
                connection = websocketConnections[url];
                if (typeof connection === "undefined") {
                    throw new Error("Failed to connect websocket in VS Code Extension");
                }
                connection.send(data.message);
                break;
            }
            case "openFile": {
                (0, vscode_1.openEditorAndRevealRange)(data.path, undefined, vscode.ViewColumn.One);
                break;
            }
            case "toggleDevTools": {
                vscode.commands.executeCommand("workbench.action.toggleDevTools");
                vscode.commands.executeCommand("continue.viewLogs");
                break;
            }
            case "reloadWindow": {
                vscode.commands.executeCommand("workbench.action.reloadWindow");
                break;
            }
            case "focusEditor": {
                (0, commands_1.setFocusedOnContinueInput)(false);
                vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
                break;
            }
            case "withProgress": {
                // This message allows withProgress to be used in the webview
                if (data.done) {
                    // Will be caught in the listener created below
                    break;
                }
                let title = data.title;
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title,
                    cancellable: false,
                }, async () => {
                    return new Promise((resolve, reject) => {
                        let listener = panel.webview.onDidReceiveMessage(async (data) => {
                            if (data.type === "withProgress" &&
                                data.done &&
                                data.title === title) {
                                listener.dispose();
                                resolve();
                            }
                        });
                    });
                });
                break;
            }
        }
    });
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>const vscode = acquireVsCodeApi();</script>
        <link href="${styleMainUri}" rel="stylesheet">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        
        <title>Continue</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>`;
}
exports.setupDebugPanel = setupDebugPanel;
class ContinueGUIWebviewViewProvider {
    constructor(sessionIdPromise) {
        this.sessionIdPromise = sessionIdPromise;
    }
    resolveWebviewView(webviewView, _context, _token) {
        webviewView.webview.html = setupDebugPanel(webviewView, this.sessionIdPromise);
    }
}
exports.ContinueGUIWebviewViewProvider = ContinueGUIWebviewViewProvider;
ContinueGUIWebviewViewProvider.viewType = "continue.continueGUIView";
//# sourceMappingURL=debugPanel.js.map