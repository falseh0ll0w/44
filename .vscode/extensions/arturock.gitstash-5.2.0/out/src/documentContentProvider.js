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
exports.DocumentContentProvider = void 0;
const vscode = require("vscode");
const StashGit_1 = require("./Git/StashGit");
const NodeType_1 = require("./StashNode/NodeType");
const url_1 = require("url");
class DocumentContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new url_1.URLSearchParams(uri.query);
            const cwd = params.get('cwd');
            const index = parseInt(params.get('index'), 10);
            const path = params.get('path');
            const oldPath = params.get('oldPath');
            const type = params.get('type');
            const side = params.get('side');
            const stashGit = new StashGit_1.default();
            let contents;
            try {
                if (type === NodeType_1.default.Deleted) {
                    contents = stashGit.getParentContents(cwd, index, path);
                }
                else if (type === NodeType_1.default.IndexAdded) {
                    contents = stashGit.getStashContents(cwd, index, path);
                }
                else if (type === NodeType_1.default.Modified) {
                    contents = side === "p" /* Parent */
                        ? stashGit.getParentContents(cwd, index, path)
                        : stashGit.getStashContents(cwd, index, path);
                }
                else if (type === NodeType_1.default.Renamed) {
                    contents = side === "p" /* Parent */
                        ? stashGit.getParentContents(cwd, index, oldPath)
                        : stashGit.getStashContents(cwd, index, path);
                }
                else if (type === NodeType_1.default.Untracked) {
                    contents = stashGit.getThirdParentContents(cwd, index, path);
                }
            }
            catch (e) {
                console.log(e);
            }
            console.log(`provideTextDocumentContent type[${type}] side[${side}]`);
            console.log(uri.query);
            return (yield contents).toString();
        });
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    update(uri) {
        this.onDidChangeEmitter.fire(uri);
    }
}
exports.DocumentContentProvider = DocumentContentProvider;
//# sourceMappingURL=documentContentProvider.js.map