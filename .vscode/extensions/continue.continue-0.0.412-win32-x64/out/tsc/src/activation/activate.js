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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateExtension = exports.ideProtocolClient = exports.extensionContext = void 0;
const vscode = __importStar(require("vscode"));
const continueIdeClient_1 = __importDefault(require("../continueIdeClient"));
const bridge_1 = require("../bridge");
const debugPanel_1 = require("../debugPanel");
const environmentSetup_1 = require("./environmentSetup");
const codeLens_1 = require("../lang-server/codeLens");
const commands_1 = require("../commands");
const codeActions_1 = __importDefault(require("../lang-server/codeActions"));
const PACKAGE_JSON_RAW_GITHUB_URL = "https://raw.githubusercontent.com/continuedev/continue/HEAD/extension/package.json";
exports.extensionContext = undefined;
function getExtensionVersionInt(versionString) {
    return parseInt(versionString.replace(/\./g, ""));
}
function addPythonPathForConfig() {
    // Add to python.analysis.extraPaths global setting so config.py gets LSP
    if (vscode.workspace.workspaceFolders?.some((folder) => folder.uri.fsPath.endsWith("continue"))) {
        // Not for the Continue repo
        return;
    }
    const pythonConfig = vscode.workspace.getConfiguration("python");
    const analysisPaths = pythonConfig.get("analysis.extraPaths");
    const autoCompletePaths = pythonConfig.get("autoComplete.extraPaths");
    const pathToAdd = exports.extensionContext?.extensionPath;
    if (analysisPaths && pathToAdd && !analysisPaths.includes(pathToAdd)) {
        analysisPaths.push(pathToAdd);
        pythonConfig.update("analysis.extraPaths", analysisPaths);
    }
    if (autoCompletePaths &&
        pathToAdd &&
        !autoCompletePaths.includes(pathToAdd)) {
        autoCompletePaths.push(pathToAdd);
        pythonConfig.update("autoComplete.extraPaths", autoCompletePaths);
    }
}
async function activateExtension(context) {
    exports.extensionContext = context;
    console.log("Using Continue version: ", (0, environmentSetup_1.getExtensionVersion)());
    try {
        console.log("In workspace: ", vscode.workspace.workspaceFolders?.[0].uri.fsPath);
    }
    catch (e) {
        console.log("Error getting workspace folder: ", e);
    }
    // Register commands and providers
    (0, codeLens_1.registerAllCodeLensProviders)(context);
    (0, commands_1.registerAllCommands)(context);
    (0, codeActions_1.default)();
    addPythonPathForConfig();
    // Start the server
    const sessionIdPromise = (async () => {
        await (0, environmentSetup_1.startContinuePythonServer)();
        console.log("Continue server started");
        // Initialize IDE Protocol Client
        const serverUrl = (0, bridge_1.getContinueServerUrl)();
        exports.ideProtocolClient = new continueIdeClient_1.default(`${serverUrl.replace("http", "ws")}/ide/ws`, context);
        return await exports.ideProtocolClient.getSessionId();
    })();
    // Register Continue GUI as sidebar webview, and beginning a new session
    const provider = new debugPanel_1.ContinueGUIWebviewViewProvider(sessionIdPromise);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("continue.continueGUIView", provider, {
        webviewOptions: { retainContextWhenHidden: true },
    }));
    // vscode.commands.executeCommand("continue.focusContinueInput");
}
exports.activateExtension = activateExtension;
//# sourceMappingURL=activate.js.map