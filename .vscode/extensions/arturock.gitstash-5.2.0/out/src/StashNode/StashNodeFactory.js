'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const NodeType_1 = require("./NodeType");
const StashNode_1 = require("./StashNode");
const path_1 = require("path");
class default_1 {
    /**
     * Generates a repository node.
     *
     * @param path the repository path
     */
    createRepositoryNode(path) {
        // may be undefined if the directory is not part of the workspace
        // this happens on upper directories by negative search depth setting
        const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.file(path));
        return new StashNode_1.default({
            type: NodeType_1.default.Repository,
            name: workspaceFolder ? workspaceFolder.name : path_1.basename(path),
            index: undefined,
            parent: undefined,
            date: undefined,
            path: path,
        });
    }
    /**
     * Generates a stash node.
     *
     * @param stash the stash to use as base
     */
    createStashNode(stash, parentNode) {
        return new StashNode_1.default({
            type: NodeType_1.default.Stash,
            name: stash.description,
            index: stash.index,
            parent: parentNode,
            date: stash.date,
        });
    }
    /**
     * Generates a file node.
     *
     * @param path       the file path
     * @param file       the file name or the new and old name on renamed file
     * @param parentNode the parent node
     * @param type       the stash type
     */
    createFileNode(path, file, parentNode, type) {
        return new StashNode_1.default({
            type: type,
            name: type === NodeType_1.default.Renamed ? file.new : file,
            oldName: type === NodeType_1.default.Renamed ? file.old : undefined,
            path: path,
            index: undefined,
            parent: parentNode,
            date: parentNode.date,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=StashNodeFactory.js.map