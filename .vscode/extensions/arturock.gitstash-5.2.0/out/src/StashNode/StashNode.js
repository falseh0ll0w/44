'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const NodeType_1 = require("./NodeType");
class StashNode {
    constructor(source) {
        this.source = source;
        this.children = [];
    }
    /**
     * Gets the node type.
     */
    get type() {
        return this.source.type;
    }
    /**
     * Gets the node name.
     */
    get name() {
        return this.source.name;
    }
    /**
     * Gets the node old name.
     */
    get oldName() {
        return this.source.oldName;
    }
    /**
     * Gets the node index.
     */
    get index() {
        return this.source.index;
    }
    /**
     * Gets the node parent index.
     */
    get parent() {
        return this.source.parent;
    }
    /**
     * Gets the node generation date.
     */
    get date() {
        return this.source.date;
    }
    /**
     * Indicates if the node represents a stashed file or not.
     */
    get isFile() {
        return [
            NodeType_1.default.Deleted,
            NodeType_1.default.IndexAdded,
            NodeType_1.default.Modified,
            NodeType_1.default.Untracked,
        ].indexOf(this.type) > -1;
    }
    /**
     * Gets the file path of the stashed file.
     */
    get path() {
        if (this.type === NodeType_1.default.Repository) {
            return this.source.path;
        }
        if (this.type === NodeType_1.default.Stash) {
            return this.source.parent.path;
        }
        if (this.isFile) {
            return `${this.source.path}/${this.name}`;
        }
        return null;
    }
}
exports.default = StashNode;
//# sourceMappingURL=StashNode.js.map