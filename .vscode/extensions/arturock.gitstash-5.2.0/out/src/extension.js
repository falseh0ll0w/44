'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const Commands_1 = require("./Commands");
const Config_1 = require("./Config");
const DiffDisplayer_1 = require("./DiffDisplayer");
const documentContentProvider_1 = require("./documentContentProvider");
const EmptyDocumentContentProvider_1 = require("./EmptyDocumentContentProvider");
const fileSystemWatcherManager_1 = require("./fileSystemWatcherManager");
const GitBridge_1 = require("./GitBridge");
const GitStashTreeDataProvider_1 = require("./GitStashTreeDataProvider");
const RepositoryTreeBuilder_1 = require("./StashNode/RepositoryTreeBuilder");
const StashCommands_1 = require("./StashCommands");
const StashLabels_1 = require("./StashLabels");
const uriGenerator_1 = require("./uriGenerator");
const WorkspaceGit_1 = require("./Git/WorkspaceGit");
function activate(context) {
    const channelName = 'GitStash';
    const config = new Config_1.default();
    const gitBridge = new GitBridge_1.default();
    const builder = new RepositoryTreeBuilder_1.default(new WorkspaceGit_1.default(config));
    const stashLabels = new StashLabels_1.default(config);
    const treeProvider = new GitStashTreeDataProvider_1.default(config, builder, gitBridge, stashLabels);
    const documentProvider = new documentContentProvider_1.DocumentContentProvider();
    const emptyDocumentProvider = new EmptyDocumentContentProvider_1.EmptyDocumentContentProvider();
    const stashCommands = new Commands_1.Commands(new WorkspaceGit_1.default(config), new StashCommands_1.StashCommands(config, vscode_1.window.createOutputChannel(channelName), stashLabels), new DiffDisplayer_1.DiffDisplayer(new uriGenerator_1.default(gitBridge), stashLabels), stashLabels);
    const workspaceGit = new WorkspaceGit_1.default(config);
    notifyHasRepository(workspaceGit);
    const watcherManager = new fileSystemWatcherManager_1.FileSystemWatcherManager(workspaceGit.getRepositories(), (projectDirectory) => treeProvider.reload('update', projectDirectory));
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('gitstash.explorer', treeProvider), vscode_1.workspace.registerTextDocumentContentProvider(uriGenerator_1.default.fileScheme, documentProvider), vscode_1.workspace.registerTextDocumentContentProvider(uriGenerator_1.default.emptyFileScheme, emptyDocumentProvider), vscode_1.commands.registerCommand('gitstash.explorer.toggle', treeProvider.toggle), vscode_1.commands.registerCommand('gitstash.explorer.refresh', treeProvider.refresh), vscode_1.commands.registerCommand('gitstash.stash', stashCommands.stash), vscode_1.commands.registerCommand('gitstash.clear', stashCommands.clear), vscode_1.commands.registerCommand('gitstash.show', stashCommands.show), vscode_1.commands.registerCommand('gitstash.pop', stashCommands.pop), vscode_1.commands.registerCommand('gitstash.apply', stashCommands.apply), vscode_1.commands.registerCommand('gitstash.branch', stashCommands.branch), vscode_1.commands.registerCommand('gitstash.drop', stashCommands.drop), vscode_1.commands.registerCommand('gitstash.applyOrPop', stashCommands.applyOrPop), vscode_1.commands.registerCommand('gitstash.diffCurrent', stashCommands.diffCurrent), vscode_1.commands.registerCommand('gitstash.applySingle', stashCommands.applySingle), vscode_1.commands.registerCommand('gitstash.createSingle', stashCommands.createSingle), vscode_1.workspace.onDidChangeWorkspaceFolders((e) => {
        notifyHasRepository(workspaceGit);
        watcherManager.configure(e);
        treeProvider.reload('settings');
    }), vscode_1.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('gitstash')) {
            config.reload();
            treeProvider.reload('settings');
        }
    }), watcherManager);
    treeProvider.toggle();
}
exports.activate = activate;
/**
 * Checks if there is at least one git repository open and notifies it to vsc.
 */
function notifyHasRepository(workspaceGit) {
    void workspaceGit
        .hasGitRepository()
        .then((has) => vscode_1.commands.executeCommand('setContext', 'hasGitRepository', has));
}
//# sourceMappingURL=extension.js.map