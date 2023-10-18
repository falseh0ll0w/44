'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class Git {
    /**
     * Executes a git command.
     *
     * @param args the string array with the argument list
     * @param cwd  the string with the current working directory
     */
    call(args, cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = [];
            const errors = [];
            const cmd = child_process_1.spawn('git', args, { cwd });
            cmd.stderr.setEncoding('utf8');
            return new Promise((resolve, reject) => {
                cmd.stdout.on('data', (chunk) => response.push(chunk));
                cmd.stdout.on('error', (err) => errors.push(err.message));
                cmd.stderr.on('data', (chunk) => errors.push(chunk));
                cmd.stderr.on('error', (err) => errors.push(err.message));
                cmd.on('close', (code) => {
                    const bufferResponse = response.length
                        ? Buffer.concat(response)
                        : Buffer.from(new ArrayBuffer(0));
                    if (code === 0) {
                        errors.length === 0
                            ? resolve(bufferResponse)
                            : resolve(`${errors.join(' ')}\n${bufferResponse.toString('utf8')}`.trim());
                    }
                    else {
                        reject(`${errors.join(' ')}\n${bufferResponse.toString('utf8')}`.trim());
                    }
                });
            });
        });
    }
    /**
     * Executes a git command.
     *
     * @param args     the string array with the argument list
     * @param cwd      the string with the current working directory
     * @param encoding the string with the optional encoding to replace utf8
     */
    exec(args, cwd, encoding) {
        return __awaiter(this, void 0, void 0, function* () {
            return this
                .call(args, cwd)
                .then((data) => data instanceof Buffer ? data.toString(encoding || 'utf8') : data);
        });
    }
}
exports.default = Git;
//# sourceMappingURL=Git.js.map