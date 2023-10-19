import { IDocContext, IDocTransformer } from '../../common/documents';
export declare class SecretRedactor implements IDocTransformer {
    #private;
    constructor();
    transform(context: IDocContext): IDocContext;
    redactSecrets(raw: string): string;
}
