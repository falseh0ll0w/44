import { TextDocuments } from 'vscode-languageserver';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';
export interface IDocContext {
    prefix: string;
    suffix: string;
    filename: string;
}
export interface IDocTransformer {
    transform(context: IDocContext): IDocContext;
}
export declare class DocumentTransformer {
    private documents;
    private transformers;
    constructor(documents: TextDocuments<TextDocument>, transformers?: IDocTransformer[]);
    get(uri: string): TextDocument | undefined;
    getContext(uri: string, position: Position): IDocContext | undefined;
    transform(context: IDocContext): IDocContext;
}
export declare function getDocContext(document: TextDocument, position: Position): IDocContext;
