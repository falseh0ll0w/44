'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const NodeType_1 = require("./StashNode/NodeType");
class default_1 {
    constructor(config) {
        this.config = config;
    }
    /**
     * Generates a node name.
     *
     * @param node The node to be used as base
     */
    getName(node) {
        switch (node.type) {
            case NodeType_1.default.Repository:
                return this.parseRepositoryLabel(node, this.config.get('explorer.labels.repositoryFormat'));
            case NodeType_1.default.Stash:
                return this.parseStashLabel(node, this.config.get('explorer.labels.stashFormat'));
            case NodeType_1.default.Deleted:
                return this.parseFileLabel(node, this.config.get('explorer.labels.deletedFileFormat'));
            case NodeType_1.default.IndexAdded:
                return this.parseFileLabel(node, this.config.get('explorer.labels.addedFileFormat'));
            case NodeType_1.default.Modified:
                return this.parseFileLabel(node, this.config.get('explorer.labels.modifiedFileFormat'));
            case NodeType_1.default.Renamed:
                return this.parseFileLabel(node, this.config.get('explorer.labels.renamedFileFormat'));
            case NodeType_1.default.Untracked:
                return this.parseFileLabel(node, this.config.get('explorer.labels.untrackedFileFormat'));
        }
    }
    /**
     * Generates a node tooltip.
     *
     * @param node The node to be used as base
     */
    getTooltip(node) {
        switch (node.type) {
            case NodeType_1.default.Repository:
                return this.parseRepositoryLabel(node, this.config.get('explorer.labels.repositoryTooltipFormat'));
            case NodeType_1.default.Stash:
                return this.parseStashLabel(node, this.config.get('explorer.labels.stashTooltipFormat'));
            case NodeType_1.default.Deleted:
                return this.parseFileLabel(node, this.config.get('explorer.labels.deletedFileTooltipFormat'));
            case NodeType_1.default.IndexAdded:
                return this.parseFileLabel(node, this.config.get('explorer.labels.addedFileTooltipFormat'));
            case NodeType_1.default.Modified:
                return this.parseFileLabel(node, this.config.get('explorer.labels.modifiedFileTooltipFormat'));
            case NodeType_1.default.Renamed:
                return this.parseFileLabel(node, this.config.get('explorer.labels.renamedFileTooltipFormat'));
            case NodeType_1.default.Untracked:
                return this.parseFileLabel(node, this.config.get('explorer.labels.untrackedFileTooltipFormat'));
        }
    }
    /**
     * Generates a repository label.
     *
     * @param repositoryNode The node to be used as base
     */
    parseRepositoryLabel(repositoryNode, template) {
        return template
            .replace('${name}', repositoryNode.name)
            .replace('${directory}', path.basename(repositoryNode.path))
            .replace('${path}', repositoryNode.path)
            .replace('${stashesCount}', repositoryNode.children.length.toString());
    }
    /**
     * Generates a stash item label.
     *
     * @param stashNode The node to be used as base
     */
    parseStashLabel(stashNode, template) {
        return template
            .replace('${index}', stashNode.index.toString())
            .replace('${branch}', this.getStashBranch(stashNode))
            .replace('${description}', this.getStashDescription(stashNode))
            .replace('${date}', stashNode.date);
    }
    /**
     * Generates a stashed file label.
     *
     * @param fileNode The node to be used as base
     */
    parseFileLabel(fileNode, template) {
        return template
            .replace('${filename}', path.basename(fileNode.name))
            .replace('${oldFilename}', fileNode.oldName ? path.basename(fileNode.oldName) : '')
            .replace('${filepath}', `${path.dirname(fileNode.name)}/`)
            .replace('${type}', this.getTypeLabel(fileNode));
    }
    /**
     * Generates the diff document title name.
     *
     * @param fileNode the file node to be shown
     * @param hint     the hint reference to know file origin
     */
    getDiffTitle(fileNode, hint) {
        return this.config.settings
            .get('editor.diffTitleFormat', '')
            .replace('${filename}', path.basename(fileNode.name))
            .replace('${filepath}', `${path.dirname(fileNode.name)}/`)
            .replace('${date}', fileNode.date)
            .replace('${stashIndex}', `${fileNode.parent.index}`)
            .replace('${description}', this.getStashDescription(fileNode.parent))
            .replace('${branch}', this.getStashBranch(fileNode.parent))
            .replace('${type}', this.getTypeLabel(fileNode))
            .replace('${hint}', this.getHint(fileNode, hint));
    }
    /**
     * Gets the stash description.
     *
     * @param stashNode the source node
     */
    getStashDescription(stashNode) {
        return stashNode.name.substring(stashNode.name.indexOf(':') + 2);
    }
    /**
     * Gets the stash branch.
     *
     * @param stashNode the source node
     */
    getStashBranch(stashNode) {
        return stashNode.name.indexOf('WIP on ') === 0
            ? stashNode.name.substring(7, stashNode.name.indexOf(':'))
            : stashNode.name.substring(3, stashNode.name.indexOf(':'));
    }
    /**
     * Gets a label for the file node type.
     *
     * @param fileNode the source node
     */
    getTypeLabel(fileNode) {
        switch (fileNode.type) {
            case NodeType_1.default.Deleted: return 'Deleted';
            case NodeType_1.default.IndexAdded: return 'Index Added';
            case NodeType_1.default.Modified: return 'Modified';
            case NodeType_1.default.Renamed: return 'Renamed';
            case NodeType_1.default.Untracked: return 'Untracked';
            default: return 'Other';
        }
    }
    /**
     * Generates a hint for the file node title.
     *
     * @param fileNode the source node
     */
    getHint(fileNode, fromStash) {
        const type = this.getTypeLabel(fileNode).toLowerCase();
        const reference = fromStash ? 'original' : 'actual';
        const values = fromStash
            ? { l: reference, r: type }
            : { l: type, r: reference };
        return `${values.l} ⟷ ${values.r}`;
    }
}
exports.default = default_1;
//# sourceMappingURL=StashLabels.js.map