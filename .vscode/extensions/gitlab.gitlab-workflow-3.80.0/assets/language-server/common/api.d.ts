import { IClientInfo } from './config';
import { IDocContext } from './documents';
export declare const GITLAB_API_BASE_URL = "https://gitlab.com";
export interface IGitLabAPI {
    configureApi({ token, baseUrl }: {
        token: string;
        baseUrl: string;
    }): void;
    checkToken(token: string): Promise<TokenCheckResponse>;
    setClientInfo(clientInfo: IClientInfo | undefined): void;
    getCodeSuggestions(file_info: IDocContext): Promise<CodeSuggestionResponse | undefined>;
}
export interface CodeSuggestionRequest {
    prompt_version: number;
    project_path: string;
    project_id: number;
    current_file: CodeSuggestionRequestCurrentFile;
}
export interface CodeSuggestionRequestCurrentFile {
    file_name: string;
    content_above_cursor: string;
    content_below_cursor: string;
}
export interface CodeSuggestionResponse {
    choices: CodeSuggestionResponseChoice[] | undefined;
}
export interface CodeSuggestionResponseChoice {
    text: string;
}
export interface CompletionToken {
    access_token: string;
    expires_in: number;
    created_at: number;
}
export interface PersonalAccessToken {
    name: string;
    scopes: string[];
    active: boolean;
}
export interface OAuthToken {
    scope: string[];
}
export interface TokenCheckResponse {
    valid: boolean;
    reason?: 'unknown' | 'not_active' | 'invalid_scopes';
    message?: string;
}
export declare class GitLabAPI implements IGitLabAPI {
    #private;
    constructor(baseURL?: string, token?: string);
    configureApi({ token, baseUrl }: {
        token: string;
        baseUrl: string;
    }): Promise<void>;
    checkToken(token: string): Promise<TokenCheckResponse>;
    setClientInfo(clientInfo: IClientInfo): void;
    getCodeSuggestions(context: IDocContext): Promise<CodeSuggestionResponse | undefined>;
}
