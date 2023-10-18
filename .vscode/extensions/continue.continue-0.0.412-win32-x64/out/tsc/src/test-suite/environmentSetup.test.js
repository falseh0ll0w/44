"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert = __importStar(require("assert"));
const bridge_1 = require("../bridge");
const environmentSetup_1 = require("../activation/environmentSetup");
const node_fetch_1 = __importDefault(require("node-fetch"));
(0, mocha_1.describe)("Can start python server", () => {
    (0, mocha_1.test)("Can start python server in under 80 seconds", async function () {
        const allowedTime = 80000;
        this.timeout(allowedTime + 10000);
        console.log("Starting server in test...");
        await (0, environmentSetup_1.startContinuePythonServer)(false);
        console.log("Server started.");
        // If successful, the server is started by the extension while we wait
        await new Promise((resolve) => setTimeout(resolve, allowedTime));
        // Check if server is running
        const serverUrl = (0, bridge_1.getContinueServerUrl)();
        console.log("Server URL: ", serverUrl);
        const response = await (0, node_fetch_1.default)(`${serverUrl}/health`);
        assert.equal(response.status, 200);
    });
});
//# sourceMappingURL=environmentSetup.test.js.map