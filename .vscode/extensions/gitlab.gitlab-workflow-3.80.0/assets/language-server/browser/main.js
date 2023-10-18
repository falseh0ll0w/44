"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("vscode-languageserver/browser");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const common_1 = require("../common");
const messageReader = new browser_1.BrowserMessageReader(self);
const messageWriter = new browser_1.BrowserMessageWriter(self);
const connection = (0, browser_1.createConnection)(messageReader, messageWriter);
const documents = new browser_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const transformer = new common_1.DocumentTransformer(documents);
(0, common_1.setup)(connection, transformer);
// Make the text document manager listen on the connection for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=main.js.map