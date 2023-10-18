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
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const vscode_1 = require("vscode");
class UriGenerator {
    constructor(gitBridge) {
        this.supportedBinaryFiles = [
            '.bmp',
            '.gif',
            '.jpe',
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
        ];
        this.gitBridge = gitBridge;
        tmp.setGracefulCleanup();
    }
    /**
     * Creates an Uri for the given node.
     *
     * @param node  the node to be used as base for the URI
     * @param stage the file stash stage
     */
    create(node, stage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!node) {
                return vscode_1.Uri.parse(`${UriGenerator.emptyFileScheme}:`);
            }
            if (this.supportedBinaryFiles.indexOf(path.extname(node.name)) > -1) {
                return vscode_1.Uri.file(this.createTmpFile(yield this.gitBridge.getFileContents(node, stage), node.name).name);
            }
            return this.generateUri(node, stage);
        });
    }
    /**
     * Generates an Uri representing the stash file.
     *
     * @param node the node to be used as base for the URI
     * @param side the editor side
     */
    generateUri(node, side) {
        const timestamp = new Date().getTime();
        const query = `cwd=${node.parent.path}`
            + `&index=${node.parent.index}`
            + `&path=${node.name}`
            + `&oldPath=${node.oldName || ''}`
            + `&type=${node.type}`
            + `&side=${side || ''}`
            + `&t=${timestamp}`;
        return vscode_1.Uri.parse(`${UriGenerator.fileScheme}:${node.path}?${query}`);
    }
    /**
     * Generates a tmp file with the given content.
     *
     * @param content  the buffer with the content
     * @param filename the string with the filename
     */
    createTmpFile(content, filename) {
        const file = tmp.fileSync({
            prefix: 'vscode-gitstash-',
            postfix: path.extname(filename),
        });
        fs.writeFileSync(file.name, content);
        return file;
    }
}
exports.default = UriGenerator;
UriGenerator.emptyFileScheme = 'gitdiff-no-contents';
UriGenerator.fileScheme = 'gitdiff-stashed-contents';
//# sourceMappingURL=uriGenerator.js.map