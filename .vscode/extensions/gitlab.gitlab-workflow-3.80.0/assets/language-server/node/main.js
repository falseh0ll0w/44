"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const common_1 = require("../common");
const secret_redaction_1 = require("./secret_redaction");
const connection = (0, node_1.createConnection)();
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const transformer = new common_1.DocumentTransformer(documents, [new secret_redaction_1.SecretRedactor()]);
(0, common_1.setup)(connection, transformer);
// Make the text document manager listen on the connection for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=main.js.map