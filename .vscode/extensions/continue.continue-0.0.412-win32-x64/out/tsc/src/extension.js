"use strict";
/**
 * This is the entry point for the extension.
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
exports.deactivate = exports.activate = exports.capture = void 0;
const vscode = __importStar(require("vscode"));
const environmentSetup_1 = require("./activation/environmentSetup");
const vscode_1 = require("./util/vscode");
let client = undefined;
async function capture(args) {
    console.log("Capturing posthog event: ", args);
    if (!client) {
        const { PostHog } = await Promise.resolve().then(() => __importStar(require("posthog-node")));
        client = new PostHog("phc_JS6XFROuNbhJtVCEdTSYk6gl5ArRrTNMpCcguAXlSPs", {
            host: "https://app.posthog.com",
        });
    }
    client.capture(args);
}
exports.capture = capture;
async function dynamicImportAndActivate(context) {
    if (!context.globalState.get("hasBeenInstalled")) {
        context.globalState.update("hasBeenInstalled", true);
        capture({
            distinctId: (0, vscode_1.getUniqueId)(),
            event: "install",
            properties: {
                extensionVersion: (0, environmentSetup_1.getExtensionVersion)(),
            },
        });
    }
    const { activateExtension } = await Promise.resolve().then(() => __importStar(require("./activation/activate")));
    try {
        await activateExtension(context);
    }
    catch (e) {
        console.log("Error activating extension: ", e);
        vscode.window
            .showInformationMessage("Error activating the Continue extension.", "View Logs", "Retry")
            .then((selection) => {
            if (selection === "View Logs") {
                vscode.commands.executeCommand("continue.viewLogs");
            }
            else if (selection === "Retry") {
                // Reload VS Code window
                vscode.commands.executeCommand("workbench.action.reloadWindow");
            }
        });
    }
}
function activate(context) {
    dynamicImportAndActivate(context);
}
exports.activate = activate;
function deactivate() {
    capture({
        distinctId: (0, vscode_1.getUniqueId)(),
        event: "deactivate",
        properties: {
            extensionVersion: (0, environmentSetup_1.getExtensionVersion)(),
        },
    });
    client?.shutdown();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map