'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const NodeType_1 = require("./StashNode/NodeType");
const path_1 = require("path");
class GitStashTreeDataProvider {
    constructor(config, repositoryTreeBuilder, gitBridge, stashLabels) {
        this.onDidChangeTreeDataEmitter = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;
        this.rawStashes = {};
        /**
         * Reloads the explorer tree.
         */
        this.refresh = () => {
            this.reload('force');
        };
        /**
         * Toggles the explorer tree.
         */
        this.toggle = () => {
            this.showExplorer = this.showExplorer === undefined
                ? this.config.get('explorer.enabled')
                : !this.showExplorer;
            void vscode_1.commands.executeCommand('setContext', 'gitstash.explorer.enabled', this.showExplorer);
        };
        this.config = config;
        this.repositoryTreeBuilder = repositoryTreeBuilder;
        this.gitBridge = gitBridge;
        this.stashLabels = stashLabels;
    }
    /**
     * Gets the tree children, which may be repositories, stashes or files.
     *
     * @param node the parent node for the requested children
     */
    getChildren(node) {
        return !node
            ? this.repositoryTreeBuilder.buildRepositoryTrees()
            : node.children;
    }
    /**
     * Generates a tree item for the specified node.
     *
     * @param node the node to be used as base
     */
    getTreeItem(node) {
        switch (node.type) {
            case NodeType_1.default.Repository: return this.getRepositoryItem(node);
            case NodeType_1.default.Stash: return this.getStashItem(node);
            default: return this.getFileItem(node);
        }
    }
    /**
     * Reloads the git stash tree view.
     *
     * @param type        the event type: settings, force, create, update, delete
     * @param projectPath the URI of the project with content changes
     */
    reload(type, projectPath) {
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        this.loadTimeout = setTimeout((type, pathUri) => {
            if (['settings', 'force'].indexOf(type) !== -1) {
                this.onDidChangeTreeDataEmitter.fire();
            }
            else {
                const path = pathUri.fsPath;
                void this.gitBridge.getRawStashesList(path).then((rawStash) => {
                    const cachedRawStash = this.rawStashes[path];
                    if (!cachedRawStash || cachedRawStash !== rawStash) {
                        this.rawStashes[path] = rawStash;
                        this.onDidChangeTreeDataEmitter.fire();
                    }
                });
            }
        }, type === 'force' ? 250 : 750, type, projectPath);
    }
    /**
     * Generates an repository tree item.
     *
     * @param node the node to be used as base
     */
    getRepositoryItem(node) {
        return {
            id: `${node.type}.${node.path}`,
            label: this.stashLabels.getName(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: this.getIcon('repository.svg'),
            contextValue: 'repository',
            collapsibleState: vscode_1.TreeItemCollapsibleState.Collapsed,
        };
    }
    /**
     * Generates an stash tree item.
     *
     * @param node the node to be used as base
     */
    getStashItem(node) {
        return {
            id: `${node.type}.${node.parent.path}.${node.index}`,
            label: this.stashLabels.getName(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: this.getIcon('chest.svg'),
            contextValue: 'stash',
            collapsibleState: vscode_1.TreeItemCollapsibleState.Collapsed,
        };
    }
    /**
     * Generates a stashed file tree item.
     *
     * @param node the node to be used as base
     */
    getFileItem(node) {
        let context = 'file';
        switch (node.type) {
            case (NodeType_1.default.Deleted):
                context += ':deleted';
                break;
            case (NodeType_1.default.IndexAdded):
                context += ':indexAdded';
                break;
            case (NodeType_1.default.Modified):
                context += ':modified';
                break;
            case (NodeType_1.default.Renamed):
                context += ':renamed';
                break;
            case (NodeType_1.default.Untracked):
                context += ':untracked';
                break;
        }
        return {
            id: `${node.type}.${node.parent.parent.path}.${node.parent.index}.${node.name}`,
            label: this.stashLabels.getName(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: this.getFileIcon(node.type),
            contextValue: context,
            command: {
                title: 'Show stash diff',
                command: 'gitstash.show',
                arguments: [node],
            },
        };
    }
    /**
     * Builds an icon path.
     *
     * @param filename the filename of the icon
     */
    getIcon(filename) {
        return {
            light: path_1.join(__dirname, '..', 'resources', 'icons', 'light', filename),
            dark: path_1.join(__dirname, '..', 'resources', 'icons', 'dark', filename),
        };
    }
    /**
     * Builds a file icon path.
     *
     * @param filename the filename of the icon
     */
    getFileIcon(type) {
        switch (type) {
            case NodeType_1.default.Deleted: return this.getIcon('status-deleted.svg');
            case NodeType_1.default.IndexAdded: return this.getIcon('status-added.svg');
            case NodeType_1.default.Modified: return this.getIcon('status-modified.svg');
            case NodeType_1.default.Renamed: return this.getIcon('status-renamed.svg');
            case NodeType_1.default.Untracked: return this.getIcon('status-untracked.svg');
            default: return vscode_1.ThemeIcon.File;
        }
    }
}
exports.default = GitStashTreeDataProvider;
//# sourceMappingURL=GitStashTreeDataProvider.js.map