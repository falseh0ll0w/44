"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScript = exports.runModule = void 0;
const tslib_1 = require("tslib");
const processRunner_1 = require("./processRunner");
class PythonProcessExecution {
    constructor(args, configuration) {
        this.pythonProcess = (0, processRunner_1.runProcess)(configuration.pythonPath, args, Object.assign(Object.assign({}, configuration), { environment: Object.assign(Object.assign({}, configuration.environment), { PYTHONUNBUFFERED: '1' }) }));
        this.pid = this.pythonProcess.pid;
    }
    complete() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.pythonProcess.complete();
        });
    }
    cancel() {
        this.pythonProcess.cancel();
    }
}
function run(args, configuration) {
    return new PythonProcessExecution(args, configuration);
}
function runModule(configuration) {
    return run(['-m', configuration.module].concat(configuration.args || []), configuration);
}
exports.runModule = runModule;
function runScript(configuration) {
    return run(['-c', configuration.script].concat(configuration.args || []), configuration);
}
exports.runScript = runScript;
//# sourceMappingURL=pythonRunner.js.map