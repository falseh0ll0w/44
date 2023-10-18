'use string';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffDisplayer = void 0;
const fs = require("fs");
const vscode = require("vscode");
const NodeType_1 = require("./StashNode/NodeType");
class DiffDisplayer {
    constructor(uriGenerator, stashLabels) {
        this.stashLabels = stashLabels;
        this.uriGenerator = uriGenerator;
    }
    /**
     * Shows a stashed file diff document.
     *
     * @param fileNode
     */
    showDiff(fileNode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fileNode.type === NodeType_1.default.Modified || fileNode.type === NodeType_1.default.Renamed) {
                this.displayDiff(yield this.uriGenerator.create(fileNode, "p" /* Parent */), yield this.uriGenerator.create(fileNode, "c" /* Change */), fileNode, true);
            }
            else if (fileNode.type === NodeType_1.default.Untracked) {
                this.displayDiff(yield this.uriGenerator.create(), yield this.uriGenerator.create(fileNode), fileNode, true);
            }
            else if (fileNode.type === NodeType_1.default.IndexAdded) {
                this.displayDiff(yield this.uriGenerator.create(), yield this.uriGenerator.create(fileNode), fileNode, true);
            }
            else if (fileNode.type === NodeType_1.default.Deleted) {
                this.displayDiff(yield this.uriGenerator.create(fileNode), yield this.uriGenerator.create(), fileNode, true);
            }
        });
    }
    /**
     * Shows a stashed file diff document.
     *
     * @param fileNode
     */
    showDiffCurrent(fileNode) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = fileNode.type === NodeType_1.default.Renamed
                ? `${fileNode.parent.path}/${fileNode.oldName}`
                : fileNode.path;
            if (!fs.existsSync(current)) {
                void vscode.window.showErrorMessage('No file available to compare');
                return;
            }
            if (fileNode.type === NodeType_1.default.Modified || fileNode.type === NodeType_1.default.Renamed) {
                this.displayDiff(yield this.uriGenerator.create(fileNode, "c" /* Change */), vscode.Uri.file(current), fileNode, false);
            }
            else if (fileNode.type === NodeType_1.default.Untracked) {
                this.displayDiff(yield this.uriGenerator.create(fileNode), vscode.Uri.file(current), fileNode, false);
            }
            else if (fileNode.type === NodeType_1.default.IndexAdded) {
                this.displayDiff(yield this.uriGenerator.create(fileNode), vscode.Uri.file(current), fileNode, false);
            }
            else if (fileNode.type === NodeType_1.default.Deleted) {
                this.displayDiff(yield this.uriGenerator.create(fileNode), vscode.Uri.file(current), fileNode, false);
            }
        });
    }
    /**
     * Shows the diff view with the specified files.
     *
     * @param base     the resource uri of the file prior the modification
     * @param modified the resource uri of the file after the modification
     * @param fileNode the stash node that's being displayed
     * @param hint     the hint reference to know file origin
     */
    displayDiff(base, modified, fileNode, hint) {
        void vscode.commands.executeCommand('vscode.diff', base, modified, this.stashLabels.getDiffTitle(fileNode, hint), {
            preserveFocus: true,
            preview: true,
            viewColumn: vscode.ViewColumn.Active,
        });
    }
}
exports.DiffDisplayer = DiffDisplayer;
//# sourceMappingURL=DiffDisplayer.js.map