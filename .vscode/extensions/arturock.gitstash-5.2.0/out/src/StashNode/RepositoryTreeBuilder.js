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
const StashGit_1 = require("../Git/StashGit");
const NodeType_1 = require("./NodeType");
const StashNodeFactory_1 = require("./StashNodeFactory");
class RepositoryTreeBuilder {
    constructor(workspaceGit) {
        this.workspaceGit = workspaceGit;
        this.stashGit = new StashGit_1.default();
        this.stashNodeFactory = new StashNodeFactory_1.default();
    }
    /**
     * Generates all the repository trees.
     */
    buildRepositoryTrees() {
        return __awaiter(this, void 0, void 0, function* () {
            const repositoryNodes = yield this.getRepositories();
            for (const repositoryNode of repositoryNodes) {
                yield this.buildRepositoryTree(repositoryNode);
            }
            return repositoryNodes;
        });
    }
    /**
     * Generates repository tree for the given node.
     */
    buildRepositoryTree(repositoryNode) {
        return __awaiter(this, void 0, void 0, function* () {
            repositoryNode.children = yield this.getStashes(repositoryNode);
            const getStash = (stash) => __awaiter(this, void 0, void 0, function* () {
                stash.children = yield this.getFiles(stash);
            });
            repositoryNode.children.forEach((stash) => {
                void getStash(stash);
            });
            return repositoryNode;
        });
    }
    /**
     * Gets the repositories list.
     */
    getRepositories() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.workspaceGit.getRepositories().then((rawList) => {
                const repositoryNodes = [];
                rawList.forEach((repositoryPath) => {
                    repositoryNodes.push(this.stashNodeFactory.createRepositoryNode(repositoryPath));
                });
                return repositoryNodes;
            });
        });
    }
    /**
     * Gets the stashes list.
     */
    getStashes(repositoryNode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stashGit.getStashes(repositoryNode.path).then((rawList) => {
                const stashNodes = [];
                rawList.forEach((stash) => {
                    stashNodes.push(this.stashNodeFactory.createStashNode(stash, repositoryNode));
                });
                return stashNodes;
            });
        });
    }
    /**
     * Gets the stash files.
     *
     * @param stashNode the parent stash
     */
    getFiles(stashNode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stashGit.getStashedFiles(stashNode.path, stashNode.index).then((stashedFiles) => {
                const fileNodes = [];
                const path = stashNode.path;
                stashedFiles.indexAdded.forEach((stashFile) => {
                    fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.IndexAdded));
                });
                stashedFiles.modified.forEach((stashFile) => {
                    fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Modified));
                });
                stashedFiles.renamed.forEach((stashFile) => {
                    fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Renamed));
                });
                stashedFiles.untracked.forEach((stashFile) => {
                    fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Untracked));
                });
                stashedFiles.deleted.forEach((stashFile) => {
                    fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Deleted));
                });
                return fileNodes;
            });
        });
    }
}
exports.default = RepositoryTreeBuilder;
//# sourceMappingURL=RepositoryTreeBuilder.js.map