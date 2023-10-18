'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyDocumentContentProvider = void 0;
const vscode = require("vscode");
class EmptyDocumentContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent() {
        return '';
    }
}
exports.EmptyDocumentContentProvider = EmptyDocumentContentProvider;
//# sourceMappingURL=EmptyDocumentContentProvider.js.map