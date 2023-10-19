"use strict";
/**
 * If we wanted to run or use another language server from our extension, this is how we would do it.
 */
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
exports.deactivate = exports.makeRequest = exports.startLanguageClient = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const vscode_2 = require("../util/vscode");
let client;
async function startLanguageClient(context) {
    let pythonLS = startPythonLanguageServer(context);
    pythonLS.start();
}
exports.startLanguageClient = startLanguageClient;
async function makeRequest(method, param) {
    if (!client) {
        return;
    }
    else if (client.state === node_1.State.Starting) {
        return new Promise((resolve, reject) => {
            let stateListener = client.onDidChangeState((e) => {
                if (e.newState === node_1.State.Running) {
                    stateListener.dispose();
                    resolve(client.sendRequest(method, param));
                }
                else if (e.newState === node_1.State.Stopped) {
                    stateListener.dispose();
                    reject(new Error("Language server stopped unexpectedly"));
                }
            });
        });
    }
    else {
        return client.sendRequest(method, param);
    }
}
exports.makeRequest = makeRequest;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
function startPythonLanguageServer(context) {
    let extensionPath = (0, vscode_2.getExtensionUri)().fsPath;
    const command = `cd ${path.join(extensionPath, "scripts")} && source env/bin/activate.fish && python -m pyls`;
    const serverOptions = {
        command: command,
        args: ["-vv"],
    };
    const clientOptions = {
        documentSelector: ["python"],
        synchronize: {
            configurationSection: "pyls",
        },
    };
    return new node_1.LanguageClient(command, serverOptions, clientOptions);
}
async function startPylance(context) {
    let pylance = vscode_1.extensions.getExtension("ms-python.vscode-pylance");
    await pylance?.activate();
    if (!pylance) {
        return;
    }
    let { path: lsPath } = await pylance.exports.languageServerFolder();
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(lsPath);
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "python" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    return client;
}
//# sourceMappingURL=languageClient.js.map