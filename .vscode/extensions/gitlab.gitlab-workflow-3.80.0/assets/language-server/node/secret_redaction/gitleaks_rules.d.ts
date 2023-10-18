export interface IGitleaksRule {
    id: string;
    description: string;
    secretGroup?: number;
    entropy?: number;
    allowlist?: object;
    regex: string;
    keywords: string[];
    compiledRegex?: RegExp;
}
declare const rules: Array<IGitleaksRule>;
export default rules;
