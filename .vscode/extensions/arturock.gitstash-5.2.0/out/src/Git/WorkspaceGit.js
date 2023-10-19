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
const Workspace_1 = require("../Workspace");
class WorkspaceGit extends Git_1.default {
    constructor(config) {
        super();
        this.config = config;
    }
    /**
     * Indicates if there's at least one repository available.
     */
    hasGitRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepositories(true);
            return repository && repository.length > 0;
        });
    }
    /**
     * Gets the directories for git repositories on the workspace.
     *
     * @param firstOnly indicates if return only the first repository
     */
    getRepositories(firstOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            const depth = this.config.get('dvanced.repositorySearchDepth');
            const params = [
                'rev-parse',
                '--show-toplevel',
            ];
            const paths = [];
            for (const cwd of Workspace_1.default.getRootPaths(depth)) {
                try {
                    let gitPath = (yield this.exec(params, cwd)).trim();
                    if (gitPath.length < 1) {
                        continue;
                    }
                    gitPath = vscode_1.Uri.file(gitPath).fsPath;
                    if (paths.indexOf(gitPath) === -1) {
                        paths.push(gitPath);
                        if (firstOnly) {
                            break;
                        }
                    }
                }
                catch (e) {
                    continue;
                }
            }
            paths.sort();
            return paths;
        });
    }
}
exports.default = WorkspaceGit;
//# sourceMappingURL=WorkspaceGit.js.map