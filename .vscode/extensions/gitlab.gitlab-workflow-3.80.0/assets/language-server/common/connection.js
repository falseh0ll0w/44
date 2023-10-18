"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const api_1 = require("./api");
function setup(connection, documents) {
    const config = {};
    const api = new api_1.GitLabAPI();
    // let redactor: SecretRedactor;
    connection.onInitialize((params) => {
        const { capabilities, clientInfo, initializationOptions } = params;
        const enableCodeCompletion = Boolean(capabilities?.textDocument?.completion);
        const enableSecretRedaction = initializationOptions?.codeCompletion?.enableSecretRedaction ?? true;
        config.clientInfo = clientInfo;
        api.setClientInfo(clientInfo);
        config.codeCompletion = { enabled: enableCodeCompletion, enableSecretRedaction };
        connection.sendNotification(vscode_languageserver_1.ShowMessageNotification.type, {
            message: 'Hello from the server!',
            type: vscode_languageserver_1.MessageType.Info,
        });
        return {
            capabilities: {
                completionProvider: {
                    resolveProvider: true,
                },
                textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Full,
            },
        };
    });
    connection.onInitialized(async () => {
        const { codeCompletion: { enabled: enableCodeCompletion = false, enableSecretRedaction = true } = {}, } = config;
        if (enableCodeCompletion) {
            listenCompletionEvents();
            /* if client provided the config to redact secrets create the redactor and load the rules to be used in the `onCompletion` handler */
            if (enableSecretRedaction) {
                // redactor = new SecretRedactor();
            }
        }
    });
    const TokenCheckNotification = new vscode_languageserver_1.NotificationType('$/gitlab/token/check');
    connection.onDidChangeConfiguration(async ({ settings: { token = null, baseUrl = api_1.GITLAB_API_BASE_URL } = {
        settings: {
            token: null,
            baseUrl: api_1.GITLAB_API_BASE_URL,
        },
    }, }) => {
        Object.assign(config, { baseUrl, token });
        await api.configureApi({ baseUrl, token });
        const { valid, reason, message } = (await api.checkToken(token));
        if (!valid) {
            Object.assign(config, { token: null });
            connection.sendNotification(TokenCheckNotification, {
                message,
                reason,
            });
        }
    });
    function listenCompletionEvents() {
        connection.onCompletion(async ({ textDocument, position }) => {
            let codeSuggestions = [];
            if (!config.token) {
                return [];
            }
            try {
                const context = documents.getContext(textDocument.uri, position);
                if (context === undefined) {
                    return [];
                }
                const suggestions = await api.getCodeSuggestions(context);
                if (suggestions?.choices === undefined) {
                    return [];
                }
                codeSuggestions = suggestions?.choices?.map((choice, index) => ({
                    label: `GitLab Suggestion ${index + 1}: ${choice.text}`,
                    kind: vscode_languageserver_1.CompletionItemKind.Text,
                    insertText: choice.text,
                    data: index,
                }));
            }
            catch (e) {
                console.error('Failed to get code suggestions!');
            }
            return codeSuggestions;
        });
        connection.onCompletionResolve((item) => item);
    }
}
exports.setup = setup;
//# sourceMappingURL=connection.js.map