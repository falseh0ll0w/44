'use string';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StashCommands = void 0;
const vscode = require("vscode");
const StashGit_1 = require("./Git/StashGit");
var StashType;
(function (StashType) {
    StashType[StashType["Simple"] = 0] = "Simple";
    StashType[StashType["KeepIndex"] = 1] = "KeepIndex";
    StashType[StashType["IncludeUntracked"] = 2] = "IncludeUntracked";
    StashType[StashType["IncludeUntrackedKeepIndex"] = 3] = "IncludeUntrackedKeepIndex";
    StashType[StashType["All"] = 4] = "All";
    StashType[StashType["AllKeepIndex"] = 5] = "AllKeepIndex";
})(StashType || (StashType = {}));
class StashCommands {
    constructor(config, channel, stashLabels) {
        /**
         * Generates a stash.
         */
        this.stash = (repositoryNode, type, message) => {
            const params = ['stash', 'save'];
            switch (type) {
                case StashType.KeepIndex:
                    params.push('--keep-index');
                    break;
                case StashType.IncludeUntracked:
                    params.push('--include-untracked');
                    break;
                case StashType.IncludeUntrackedKeepIndex:
                    params.push('--include-untracked');
                    params.push('--keep-index');
                    break;
                case StashType.All:
                    params.push('--all');
                    break;
                case StashType.AllKeepIndex:
                    params.push('--all');
                    params.push('--keep-index');
                    break;
            }
            if (message.length > 0) {
                params.push(message);
            }
            this.exec(repositoryNode.path, params, 'Stash created', repositoryNode);
        };
        /**
         * Removes the stashes list.
         */
        this.clear = (repositoryNode) => {
            const params = ['stash', 'clear'];
            this.exec(repositoryNode.path, params, 'Stash list cleared', repositoryNode);
        };
        /**
         * Pops a stash.
         */
        this.pop = (stashNode, withIndex) => {
            const params = ['stash', 'pop'];
            if (withIndex) {
                params.push('--index');
            }
            params.push(`stash@{${stashNode.index}}`);
            this.exec(stashNode.path, params, 'Stash popped', stashNode);
        };
        /**
         * Applies a stash.
         */
        this.apply = (stashNode, withIndex) => {
            const params = ['stash', 'apply'];
            if (withIndex) {
                params.push('--index');
            }
            params.push(`stash@{${stashNode.index}}`);
            this.exec(stashNode.path, params, 'Stash applied', stashNode);
        };
        /**
         * Branches a stash.
         */
        this.branch = (stashNode, name) => {
            const params = [
                'stash',
                'branch',
                name,
                `stash@{${stashNode.index}}`,
            ];
            this.exec(stashNode.path, params, 'Stash branched', stashNode);
        };
        /**
         * Drops a stash.
         */
        this.drop = (stashNode) => {
            const params = [
                'stash',
                'drop',
                `stash@{${stashNode.index}}`,
            ];
            this.exec(stashNode.path, params, 'Stash dropped', stashNode);
        };
        /**
         * Applies changes from a file.
         */
        this.applySingle = (fileNode) => {
            const params = [
                'checkout',
                `stash@{${fileNode.parent.index}}`,
                fileNode.name,
            ];
            this.exec(fileNode.parent.path, params, 'Changes from file applied', fileNode);
        };
        /**
         * Applies changes from a file.
         */
        this.createSingle = (fileNode) => {
            const params = [
                'checkout',
                `stash@{${fileNode.parent.index}}^3`,
                fileNode.name,
            ];
            this.exec(fileNode.parent.path, params, 'File created', fileNode);
        };
        this.config = config;
        this.channel = channel;
        this.stashLabels = stashLabels;
        this.stashGit = new StashGit_1.default();
    }
    /**
     * Executes the git command.
     *
     * @param cwd            the current working directory
     * @param params         the array of command parameters
     * @param successMessage the string message to show on success
     * @param node           the involved node
     */
    exec(cwd, params, successMessage, node) {
        this.stashGit.exec(params, cwd)
            .then((result) => {
            const issueType = this.findResultIssues(result);
            if (issueType === 'conflict') {
                this.logResult(params, 'warning', result, `${successMessage} with conflicts`, node);
            }
            else if (issueType === 'empty') {
                this.logResult(params, 'message', result, 'No local changes to save', node);
            }
            else {
                this.logResult(params, 'message', result, successMessage, node);
            }
        }, (error) => {
            const excerpt = error.substring(error.indexOf(':') + 1).trim();
            this.logResult(params, 'error', error, excerpt, node);
        })
            .catch((error) => {
            this.logResult(params, 'error', error.toString());
        });
    }
    /**
     * Parses the result searching for possible issues / errors.
     *
     * @param result the operation result
     */
    findResultIssues(result) {
        for (const line of result.split('\n')) {
            if (line.startsWith('CONFLICT (content): ')) {
                return 'conflict';
            }
            if (line.startsWith('No local changes to save')) {
                return 'empty';
            }
        }
        return null;
    }
    /**
     * Logs the command to the extension channel.
     *
     * @param params           the git command params
     * @param type             the message type
     * @param result           the result content
     * @param notificationText the optional notification message
     */
    logResult(params, type, result, notificationText, node) {
        this.prepareLogChannel();
        this.performLogging(params, result, node);
        this.showNotification(notificationText || result, type);
    }
    /**
     * Prepares the log channel to before using it.
     */
    prepareLogChannel() {
        if (this.config.settings.get('log.autoclear')) {
            this.channel.clear();
        }
        const currentTime = new Date();
        this.channel.appendLine(`> ${currentTime.toLocaleString()}`);
    }
    /**
     * Logs the command to the extension channel.
     *
     * @param params      the git command params
     * @param type        the string message type
     * @param result      the string result message
     * @param description the optional string alert description
     */
    performLogging(params, result, node) {
        if (node) {
            const cwd = node.isFile ? node.parent.path : node.path;
            this.channel.appendLine(cwd
                ? `  ${cwd} - ${this.stashLabels.getName(node)}`
                : `  ${this.stashLabels.getName(node)}`);
        }
        this.channel.appendLine(`  git ${params.join(' ')}`);
        this.channel.appendLine(`${result.trim()}\n`);
    }
    /**
     * Shows a notification with the given summary message.
     *
     * @param information the text to be displayed
     * @param type        the the message type
     */
    showNotification(information, type) {
        const summary = information.substr(0, 300);
        const actions = [{ title: 'Show log' }];
        const callback = (value) => {
            if (typeof value !== 'undefined') {
                this.channel.show(true);
            }
        };
        if (type === 'warning') {
            void vscode.window.showWarningMessage(summary, ...actions).then(callback);
        }
        else if (type === 'error') {
            void vscode.window.showErrorMessage(summary, ...actions).then(callback);
        }
        else {
            void vscode.window.showInformationMessage(summary, ...actions).then(callback);
        }
    }
}
exports.StashCommands = StashCommands;
StashCommands.StashType = StashType;
//# sourceMappingURL=StashCommands.js.map