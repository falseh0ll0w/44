"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonTracebackSnooper = exports.CommandCaptureSnooper = exports.TerminalSnooper = void 0;
class TerminalSnooper {
    constructor(callback) {
        this.callback = callback;
    }
}
exports.TerminalSnooper = TerminalSnooper;
function stripAnsi(data) {
    const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|");
    let regex = new RegExp(pattern, "g");
    return data.replace(regex, "");
}
class CommandCaptureSnooper extends TerminalSnooper {
    constructor() {
        super(...arguments);
        this.stdinBuffer = "";
        this.cursorPos = 0;
        this.stdoutHasInterrupted = false;
    }
    _cursorLeft() {
        this.cursorPos = Math.max(0, this.cursorPos - 1);
    }
    _cursorRight() {
        this.cursorPos = Math.min(this.stdinBuffer.length, this.cursorPos + 1);
    }
    // Known issue: This does not handle autocomplete.
    // Would be preferable to find a way that didn't require this all, just parsing by command prompt
    // but that has it's own challenges
    handleControlKey(data) {
        switch (data) {
            case CommandCaptureSnooper.DEL_KEY:
                this.stdinBuffer =
                    this.stdinBuffer.slice(0, this.cursorPos - 1) +
                        this.stdinBuffer.slice(this.cursorPos);
                this._cursorLeft();
                break;
            case CommandCaptureSnooper.RETURN_KEY:
                this.callback(this.stdinBuffer);
                this.stdinBuffer = "";
                break;
            case CommandCaptureSnooper.UP_KEY:
            case CommandCaptureSnooper.DOWN_KEY:
                this.stdinBuffer = "";
                break;
            case CommandCaptureSnooper.RIGHT_KEY:
                this._cursorRight();
                break;
            case CommandCaptureSnooper.LEFT_KEY:
                this._cursorLeft();
                break;
        }
    }
    onWrite(data) {
        if (CommandCaptureSnooper.CONTROL_KEYS.has(data)) {
            this.handleControlKey(data);
        }
        else {
            this.stdinBuffer =
                this.stdinBuffer.substring(0, this.cursorPos) +
                    data +
                    this.stdinBuffer.substring(this.cursorPos);
            this._cursorRight();
        }
    }
    onData(data) { }
}
exports.CommandCaptureSnooper = CommandCaptureSnooper;
CommandCaptureSnooper.RETURN_KEY = "\r";
CommandCaptureSnooper.DEL_KEY = "\x7F";
CommandCaptureSnooper.UP_KEY = "\x1B[A";
CommandCaptureSnooper.DOWN_KEY = "\x1B[B";
CommandCaptureSnooper.RIGHT_KEY = "\x1B[C";
CommandCaptureSnooper.LEFT_KEY = "\x1B[D";
CommandCaptureSnooper.CONTROL_KEYS = new Set([
    CommandCaptureSnooper.RETURN_KEY,
    CommandCaptureSnooper.DEL_KEY,
    CommandCaptureSnooper.UP_KEY,
    CommandCaptureSnooper.DOWN_KEY,
    CommandCaptureSnooper.RIGHT_KEY,
    CommandCaptureSnooper.LEFT_KEY,
]);
class PythonTracebackSnooper extends TerminalSnooper {
    constructor() {
        super(...arguments);
        this.tracebackBuffer = "";
    }
    onWrite(data) { }
    onData(data) {
        let strippedData = stripAnsi(data);
        // Strip fully blank and squiggle lines
        strippedData = strippedData
            .split("\n")
            .filter((line) => line.trim().length > 0 && line.trim() !== "~~^~~")
            .join("\n");
        // Snoop for traceback
        let idx = strippedData.indexOf(PythonTracebackSnooper.tracebackStart);
        if (idx >= 0) {
            this.tracebackBuffer = strippedData.substr(idx);
        }
        else if (this.tracebackBuffer.length > 0) {
            this.tracebackBuffer += "\n" + strippedData;
        }
        // End of traceback, send to webview
        if (this.tracebackBuffer.length > 0) {
            let wholeTraceback = PythonTracebackSnooper.tracebackEnd(this.tracebackBuffer);
            if (wholeTraceback) {
                this.callback(wholeTraceback);
                this.tracebackBuffer = "";
            }
        }
    }
}
exports.PythonTracebackSnooper = PythonTracebackSnooper;
PythonTracebackSnooper.tracebackStart = "Traceback (most recent call last):";
PythonTracebackSnooper.tracebackEnd = (buf) => {
    let lines = buf.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("  File") &&
            i + 2 < lines.length &&
            lines[i + 2][0] != " ") {
            return lines.slice(0, i + 3).join("\n");
        }
    }
    return undefined;
};
//# sourceMappingURL=snoopers.js.map