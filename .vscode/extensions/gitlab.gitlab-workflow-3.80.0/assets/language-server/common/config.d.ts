import { InitializeParams } from 'vscode-languageserver';
export type IClientInfo = InitializeParams['clientInfo'];
interface ICodeCompletionConfig {
    enabled: boolean;
    enableSecretRedaction: boolean;
}
export interface IConfig {
    baseUrl?: string;
    token?: string;
    clientInfo?: IClientInfo;
    codeCompletion?: ICodeCompletionConfig;
}
export {};
