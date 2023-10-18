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
const Git_1 = require("./Git");
const vscode_1 = require("vscode");
class StashGit extends Git_1.default {
    /**
     * Gets the raw git stash command data.
     *
     * @param cwd the current working directory
     */
    getRawStash(cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [
                'stash',
                'list',
            ];
            return (yield this.exec(params, cwd)).trim();
        });
    }
    /**
     * Gets the stashes list.
     *
     * @param cwd the current working directory
     */
    getStashes(cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const validFormats = ['default', 'iso', 'local', 'raw', 'relative', 'rfc', 'short'];
            const dateFormat = vscode_1.workspace.getConfiguration('gitstash').dateFormat;
            const params = [
                'stash',
                'list',
                `--date=${validFormats.indexOf(dateFormat) > -1 ? dateFormat : 'default'}`,
            ];
            const stashList = (yield this.exec(params, cwd)).trim();
            const list = [];
            if (stashList.length > 0) {
                stashList.split(/\r?\n/g).forEach((stash, index) => {
                    list.push({
                        index: index,
                        description: stash.substring(stash.indexOf('}:') + 2).trim(),
                        date: stash.substring(stash.indexOf('{') + 1, stash.indexOf('}')),
                    });
                });
            }
            return list;
        });
    }
    /**
     * Gets the stash files.
     *
     * @param cwd   the current working directory
     * @param index the int with the stash index
     */
    getStashedFiles(cwd, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = {
                untracked: yield this.getStashUntracked(cwd, index),
                indexAdded: [],
                modified: [],
                deleted: [],
                renamed: [],
            };
            const params = [
                'stash',
                'show',
                '--name-status',
                `stash@{${index}}`,
            ];
            try {
                const stashData = (yield this.exec(params, cwd)).trim();
                if (stashData.length > 0) {
                    const stashedFiles = stashData.split(/\r?\n/g);
                    stashedFiles.forEach((line) => {
                        const status = line.substring(0, 1);
                        const file = line.substring(1).trim();
                        if (status === 'A') {
                            files.indexAdded.push(file);
                        }
                        else if (status === 'D') {
                            files.deleted.push(file);
                        }
                        else if (status === 'M') {
                            files.modified.push(file);
                        }
                        else if (status === 'R') {
                            const fileNames = /^\d+\s+([^\t]+)\t(.+)$/.exec(file);
                            files.renamed.push({
                                new: fileNames[2],
                                old: fileNames[1],
                            });
                        }
                    });
                }
            }
            catch (e) {
                console.log('StashGit.getStashedFiles');
                console.log(e);
            }
            return files;
        });
    }
    /**
     * Gets the stash untracked files.
     *
     * @param cwd   the current working directory
     * @param index the int with the stash index
     */
    getStashUntracked(cwd, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [
                'ls-tree',
                '-r',
                '--name-only',
                `stash@{${index}}^3`,
            ];
            const list = [];
            try {
                const stashData = (yield this.exec(params, cwd)).trim();
                if (stashData.length > 0) {
                    const stashedFiles = stashData.split(/\r?\n/g);
                    stashedFiles.forEach((file) => {
                        list.push(file);
                    });
                }
            }
            catch (e) { /* we may get an error if there aren't untracked files */ }
            return list;
        });
    }
    /**
     * Gets the file contents from the stash commit.
     *
     * This gets the changed contents for:
     *  - index-added
     *  - modified
     *  - renamed
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    getStashContents(cwd, index, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [
                'show',
                `stash@{${index}}:${file}`,
            ];
            return yield this.call(params, cwd);
        });
    }
    /**
     * Gets the file contents from the parent stash commit.
     *
     * This gets the original contents for:
     *  - deleted
     *  - modified
     *  - renamed
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    getParentContents(cwd, index, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [
                'show',
                `stash@{${index}}^1:${file}`,
            ];
            return yield this.call(params, cwd);
        });
    }
    /**
     * Gets the file contents from the third (untracked) stash commit.
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    getThirdParentContents(cwd, index, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [
                'show',
                `stash@{${index}}^3:${file}`,
            ];
            return yield this.call(params, cwd);
        });
    }
}
exports.default = StashGit;
//# sourceMappingURL=StashGit.js.map