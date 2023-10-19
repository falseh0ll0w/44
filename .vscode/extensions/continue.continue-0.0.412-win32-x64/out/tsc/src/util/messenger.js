"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketMessenger = exports.Messenger = void 0;
const WebSocket = require("ws");
const node_fetch_1 = __importDefault(require("node-fetch"));
class Messenger {
}
exports.Messenger = Messenger;
class WebsocketMessenger extends Messenger {
    _newWebsocket() {
        // // Dynamic import, because WebSocket is builtin with browser, but not with node. And can't use require in browser.
        // if (typeof process === "object") {
        //   console.log("Using node");
        //   // process is only available in Node
        //   var WebSocket = require("ws");
        // }
        const newWebsocket = new WebSocket(this.serverUrl);
        for (const listener of this.onOpenListeners) {
            this.onOpen(listener);
        }
        for (const listener of this.onCloseListeners) {
            this.onClose(listener);
        }
        for (const listener of this.onErrorListeners) {
            this.onError(listener);
        }
        for (const messageType in this.onMessageListeners) {
            for (const listener of this.onMessageListeners[messageType]) {
                this.onMessageType(messageType, listener);
            }
        }
        newWebsocket.addEventListener("open", () => console.log("Websocket connection opened"));
        newWebsocket.addEventListener("error", (error) => {
            console.error("Websocket error occurred: ", error);
        });
        newWebsocket.addEventListener("close", (error) => {
            console.log("Websocket connection closed: ", error);
        });
        return newWebsocket;
    }
    async checkServerRunning(serverUrl) {
        // Check if already running by calling /health
        try {
            const response = await (0, node_fetch_1.default)(serverUrl + "/health");
            if (response.status === 200) {
                console.log("Continue python server already running");
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    constructor(serverUrl) {
        super();
        this.onMessageListeners = {};
        this.onOpenListeners = [];
        this.onCloseListeners = [];
        this.onErrorListeners = [];
        this.serverUrl = serverUrl;
        this.websocket = this._newWebsocket();
        // Wait until the server is running
        // const interval = setInterval(async () => {
        //   if (
        //     await this.checkServerRunning(
        //       serverUrl.replace("/ide/ws", "").replace("ws://", "http://")
        //     )
        //   ) {
        //     this.websocket = this._newWebsocket();
        //     clearInterval(interval);
        //   } else {
        //     console.log(
        //       "Waiting for python server to start-----------------------"
        //     );
        //   }
        // }, 1000);
        // const interval = setInterval(() => {
        //   if (this.websocket.readyState === this.websocket.OPEN) {
        //     clearInterval(interval);
        //   } else if (this.websocket.readyState !== this.websocket.CONNECTING) {
        //     this.websocket = this._newWebsocket();
        //   }
        // }, 1000);
    }
    send(messageType, data) {
        const payload = JSON.stringify({ messageType, data });
        if (this.websocket.readyState === this.websocket.OPEN) {
            this.websocket.send(payload);
        }
        else {
            if (this.websocket.readyState !== this.websocket.CONNECTING) {
                this.websocket = this._newWebsocket();
            }
            this.websocket.addEventListener("open", () => {
                this.websocket.send(payload);
            });
        }
    }
    sendAndReceive(messageType, data) {
        return new Promise((resolve, reject) => {
            const eventListener = (data) => {
                // THIS ISN"T GETTING CALLED
                resolve(data);
                this.websocket.removeEventListener("message", eventListener);
            };
            this.onMessageType(messageType, eventListener);
            this.send(messageType, data);
        });
    }
    onMessageType(messageType, callback) {
        this.websocket.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);
            if (msg.messageType === messageType) {
                callback(msg.data);
            }
        });
    }
    onMessage(callback) {
        this.websocket.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);
            callback(msg.messageType, msg.data, this);
        });
    }
    onOpen(callback) {
        this.websocket.addEventListener("open", callback);
    }
    onClose(callback) {
        this.websocket.addEventListener("close", callback);
    }
    onError(callback) {
        this.websocket.addEventListener("error", callback);
    }
    close() {
        this.websocket.close();
    }
}
exports.WebsocketMessenger = WebsocketMessenger;
//# sourceMappingURL=messenger.js.map