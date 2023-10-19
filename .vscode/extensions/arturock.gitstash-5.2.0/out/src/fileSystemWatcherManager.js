"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemWatcherManager = void 0;
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const path_1 = require("path");
// https://github.com/Microsoft/vscode/issues/3025
class FileSystemWatcherManager {
    /**
     * Creates a new watcher.
     *
     * @param repositories the open repositories when starting the extension
     * @param callback     the callback to run when identifying changes
     */
    constructor(repositories, callback) {
        this.watchers = new Map();
        this.callback = callback;
        void repositories.then((directories) => {
            directories.forEach((directory) => this.registerProjectWatcher(directory));
        });
    }
    /**
     * Adds or removes listeners according the workspace directory changes.
     *
     * @param directoryChanges the workspace directory changes description
     */
    configure(directoryChanges) {
        directoryChanges.added.forEach((changedDirectory) => {
            const directory = changedDirectory.uri.fsPath;
            this.registerProjectWatcher(directory);
        });
        directoryChanges.removed.forEach((changedDirectory) => {
            const directory = changedDirectory.uri.fsPath;
            this.removeProjectWatcher(directory);
        });
    }
    /**
     * Disposes this object.
     */
    dispose() {
        for (const path of this.watchers.keys()) {
            this.removeProjectWatcher(path);
        }
    }
    /**
     * Registers a new project directory watcher.
     *
     * @param projectPath the directory path
     */
    registerProjectWatcher(projectPath) {
        if (this.watchers.has(projectPath)) {
            return;
        }
        const pathToMonitor = path_1.join(projectPath, '.git', 'refs');
        if (!fs_1.existsSync(pathToMonitor)) {
            return;
        }
        try {
            const watcher = fs_1.watch(pathToMonitor, (event, filename) => {
                if (filename.indexOf('stash') > -1) {
                    if (filename && filename.indexOf('stash') > -1) {
                        this.callback(vscode_1.Uri.file(projectPath));
                    }
                }
            });
            this.watchers.set(projectPath, watcher);
        }
        catch (error) {
            void vscode_1.window.showErrorMessage(`Unable to a create a stashes monitor for
            ${projectPath}. This may happen on NFS or if the path is a link`);
        }
    }
    /**
     * Removes an active project directory watcher.
     *
     * @param path the directory path
     */
    removeProjectWatcher(path) {
        if (this.watchers.has(path)) {
            this.watchers.get(path).close();
            this.watchers.delete(path);
        }
    }
}
exports.FileSystemWatcherManager = FileSystemWatcherManager;
//# sourceMappingURL=fileSystemWatcherManager.js.map