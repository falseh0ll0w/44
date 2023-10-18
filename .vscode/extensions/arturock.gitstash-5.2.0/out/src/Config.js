'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class default_1 {
    constructor() {
        this.reload();
    }
    /**
     * Loads the plugin config.
     */
    reload() {
        this.settings = vscode_1.workspace.getConfiguration('gitstash');
    }
    get(section, defaultValue) {
        return this.settings.get(section, defaultValue);
    }
}
exports.default = default_1;
//# sourceMappingURL=Config.js.map