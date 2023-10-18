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
const vscode = __importStar(require("vscode"));
class ContinueQuickFixProvider {
    provideCodeActions(document, range, context, token) {
        if (context.diagnostics.length === 0) {
            return [];
        }
        const createQuickFix = (edit) => {
            const diagnostic = context.diagnostics[0];
            const quickFix = new vscode.CodeAction(edit ? "Fix with Continue" : "Ask Continue", vscode.CodeActionKind.QuickFix);
            quickFix.isPreferred = false;
            const surroundingRange = new vscode.Range(Math.max(0, range.start.line - 3), 0, Math.min(document.lineCount, range.end.line + 3), 0);
            quickFix.command = {
                command: "continue.quickFix",
                title: "Continue Quick Fix",
                arguments: [
                    diagnostic.message,
                    document.getText(surroundingRange),
                    edit,
                ],
            };
            return quickFix;
        };
        return [
            // createQuickFix(true),
            createQuickFix(false),
        ];
    }
}
ContinueQuickFixProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
];
function registerQuickFixProvider() {
    // In your extension's activate function:
    vscode.languages.registerCodeActionsProvider({ language: "*" }, new ContinueQuickFixProvider(), {
        providedCodeActionKinds: ContinueQuickFixProvider.providedCodeActionKinds,
    });
}
exports.default = registerQuickFixProvider;
//# sourceMappingURL=codeActions.js.map