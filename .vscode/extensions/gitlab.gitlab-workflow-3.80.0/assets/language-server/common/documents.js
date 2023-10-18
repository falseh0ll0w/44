"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocContext = exports.DocumentTransformer = void 0;
class DocumentTransformer {
    constructor(documents, transformers = []) {
        this.documents = documents;
        this.transformers = transformers;
    }
    get(uri) {
        return this.documents.get(uri);
    }
    getContext(uri, position) {
        const doc = this.get(uri);
        if (doc === undefined) {
            return;
        }
        return this.transform(getDocContext(doc, position));
    }
    transform(context) {
        for (const transformer of this.transformers) {
            context = transformer.transform(context);
        }
        return context;
    }
}
exports.DocumentTransformer = DocumentTransformer;
function getDocContext(document, position) {
    const prefix = document.getText({ start: document.positionAt(0), end: position });
    const suffix = document.getText({
        start: position,
        end: document.positionAt(document.getText().length),
    });
    return {
        prefix,
        suffix,
        filename: document.uri.slice(document.uri.lastIndexOf('/') + 1),
    };
}
exports.getDocContext = getDocContext;
//# sourceMappingURL=documents.js.map