'use strict';
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
const StashGit_1 = require("./Git/StashGit");
const NodeType_1 = require("./StashNode/NodeType");
class GitBridge {
    constructor() {
        this.stashGit = new StashGit_1.default();
    }
    /**
     * Gets the raw git stashes list.
     */
    getRawStashesList(cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stashGit.getRawStash(cwd).then((rawData) => rawData);
        });
    }
    /**
     * Gets the file contents of the untracked file.
     *
     * @param fileNode the stashed node file
     * @param stage    the file stash stage
     */
    getFileContents(fileNode, stage) {
        switch (fileNode.type) {
            case NodeType_1.default.Deleted:
                return this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.IndexAdded:
                return this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Modified:
                return stage === "p" /* Parent */
                    ? this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name)
                    : this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Renamed:
                return stage === "p" /* Parent */
                    ? this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.oldName)
                    : this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Untracked:
                return this.stashGit.getThirdParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
        }
    }
}
exports.default = GitBridge;
//# sourceMappingURL=GitBridge.js.map