"use strict";
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
exports.parseMajorVersion = exports.checkJavaVersion = exports.resolveRequirements = void 0;
const vscode_1 = require("vscode");
const path = require("path");
const settings_1 = require("./settings");
const channel_1 = require("./channel");
const download_1 = require("./download");
const files_1 = require("./files");
const subprocess_1 = require("./subprocess");
const pathExists = require("path-exists");
const expandHomeDir = require("expand-home-dir");
const findJavaHome = require("find-java-home");
/**
 * Resolves the requirements needed to run the extension.
 * Returns a promise that will resolve to a RequirementsData if
 * all requirements are resolved, it will reject with ErrorData if
 * if any of the requirements fails to resolve.
 */
function resolveRequirements() {
    return __awaiter(this, void 0, void 0, function* () {
        let choice = undefined;
        const SPECIFY = "Specify JAVA_HOME location manually";
        const DOWNLOAD = "Automatically download java";
        while (true) {
            try {
                if (choice == SPECIFY) {
                    let uris = yield vscode_1.window.showOpenDialog({
                        "canSelectFolders": true,
                        "canSelectFiles": false,
                        "canSelectMany": false,
                        "title": "Please select the JAVA_HOME (dir containing /bin/java) to start PyDev.",
                        "openLabel": `Select JAVA_HOME (dir containing /bin/java).`,
                    });
                    if (uris && uris.length === 1) {
                        const javaHome = uris[0].fsPath;
                        let javaExecutable = getJavaFromJavaHome(javaHome);
                        if (!(yield (0, files_1.fileExists)(javaExecutable))) {
                            throw new Error(`Directory specified does not seem to be a JAVA_HOME (/bin/java not found in: ${javaHome}).`);
                        }
                        (0, settings_1.getPyDevConfiguration)().update(settings_1.JAVA_HOME, javaHome, vscode_1.ConfigurationTarget.Global);
                        let javaVersion = yield checkJavaVersion(javaExecutable);
                        return {
                            java_executable: javaExecutable,
                            java_version: javaVersion,
                        };
                    }
                    else {
                        throw new Error("User cancelled.");
                    }
                }
                else if (choice == DOWNLOAD) {
                    return yield (0, download_1.getJavaOrDownload)();
                }
                let javaExecutable = yield discoverJavaExecutableToUse();
                let javaVersion = yield checkJavaVersion(javaExecutable);
                return {
                    java_executable: javaExecutable,
                    java_version: javaVersion,
                };
            }
            catch (error) {
                let msg = `Unable to find java to start PyDev extension. `;
                let detail = undefined;
                if (error.message) {
                    detail = `Details: ${error.message}.`;
                }
                (0, channel_1.logError)(msg, error);
                detail += "\nNote: if cancelled the extension will not be started.";
                msg += "How do you want to proceed?";
                choice = yield vscode_1.window.showErrorMessage(msg, { modal: true, detail: detail }, DOWNLOAD, SPECIFY);
                channel_1.OUTPUT_CHANNEL.appendLine(choice);
                if (!choice) {
                    throw new Error("PyDev extension will not be started (java not found nor provided by user).");
                }
            }
        }
    });
}
exports.resolveRequirements = resolveRequirements;
function getJavaFromJavaHome(javaHomeInConfig) {
    if (process.platform == "win32") {
        return path.join(javaHomeInConfig, "bin", "java.exe");
    }
    else {
        return path.join(javaHomeInConfig, "bin", "java");
    }
}
function discoverJavaExecutableToUse() {
    return __awaiter(this, void 0, void 0, function* () {
        let source;
        // Check: config manually set in python.pydev.java.home
        let javaHomeInConfig = readJavaHomeConfig();
        if (javaHomeInConfig) {
            javaHomeInConfig = expandHomeDir(javaHomeInConfig);
            if (yield (0, files_1.fileExists)(javaHomeInConfig)) {
                let javaExecutable = getJavaFromJavaHome(javaHomeInConfig);
                if (yield (0, files_1.fileExists)(javaExecutable)) {
                    return javaExecutable;
                }
                else {
                    channel_1.OUTPUT_CHANNEL.appendLine(`The ${javaExecutable} (based on the python.pydev.java.home variable defined in VS Code settings) does not exist.`);
                }
            }
            else {
                channel_1.OUTPUT_CHANNEL.appendLine("The python.pydev.java.home variable defined in VS Code settings points to a folder which does not exist.");
            }
        }
        // Check: get our internal downloaded version
        const javaDownloaded = yield (0, download_1.getExpectedJavaExecutableLocation)();
        if (yield (0, files_1.fileExists)(javaDownloaded)) {
            return javaDownloaded;
        }
        else {
            channel_1.OUTPUT_CHANNEL.appendLine(`Could not detect a java executable in: ${javaDownloaded}.`);
        }
        // Check: based on environment variables.
        let javaHome = process.env["JDK_HOME"];
        if (javaHome) {
            source = "The JDK_HOME environment variable";
        }
        else {
            javaHome = process.env["JAVA_HOME"];
            if (javaHome) {
                source = "The JAVA_HOME environment variable";
            }
        }
        if (javaHome) {
            javaHome = expandHomeDir(javaHome);
            if (yield (0, files_1.fileExists)(javaHome)) {
                let javaExecutable = getJavaFromJavaHome(javaHome);
                if (yield (0, files_1.fileExists)(pathExists)) {
                    return javaExecutable;
                }
                else {
                    channel_1.OUTPUT_CHANNEL.appendLine(`${javaExecutable} does not exist (based on ${source}).`);
                }
            }
            else {
                channel_1.OUTPUT_CHANNEL.appendLine(source + " points to a missing folder");
            }
        }
        if (process.platform == "win32") {
            let javaInProgramData = path.join(path.join("C:", "ProgramData", "Oracle", "Java", "javapath", "java.exe"));
            if (yield (0, files_1.fileExists)(javaInProgramData)) {
                return javaInProgramData;
            }
        }
        //No settings nor in expected locations, let's try to detect as last resort.
        try {
            const home = yield findJavaHome({ allowJre: true });
            let javaExecutable;
            if (process.platform == "win32") {
                javaExecutable = path.join(home, "bin", "java.exe");
            }
            else {
                javaExecutable = path.join(home, "bin", "java");
            }
            if (yield (0, files_1.fileExists)(javaExecutable)) {
                return javaExecutable;
            }
            else {
                throw new Error("Unable to find java executable");
            }
        }
        catch (err) {
            throw new Error("Java runtime could not be located");
        }
    });
}
function readJavaHomeConfig() {
    return (0, settings_1.getPyDevConfiguration)().get(settings_1.JAVA_HOME, null);
}
function checkJavaVersion(javaExecutable) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        result = yield (0, subprocess_1.execFilePromise)(javaExecutable, ["-version"], {}, { showOutputInteractively: true });
        // code to retry...
        // let tries: number = 0;
        // const maxTries = 3;
        // for (let tries = 0; tries < maxTries; tries++) {
        //     try {
        //         break;
        //     } catch (error) {
        //         if (tries == maxTries - 1) {
        //             throw error;
        //         }
        //         await sleep(200);
        //         continue;
        //     }
        // }
        let javaVersion = parseMajorVersion(result.stderr);
        if (javaVersion < 11) {
            throw new Error(`Java 11 or more recent is required to run. Found: ${javaVersion}`);
        }
        return javaVersion;
    });
}
exports.checkJavaVersion = checkJavaVersion;
function parseMajorVersion(content) {
    let regexp = /version "(.*)"/g;
    let match = regexp.exec(content);
    if (!match) {
        return 0;
    }
    let version = match[1];
    //Ignore '1.' prefix for legacy Java versions
    if (version.startsWith("1.")) {
        version = version.substring(2);
    }
    //look into the interesting bits now
    regexp = /\d+/g;
    match = regexp.exec(version);
    let javaVersion = 0;
    if (match) {
        javaVersion = parseInt(match[0]);
    }
    return javaVersion;
}
exports.parseMajorVersion = parseMajorVersion;
//# sourceMappingURL=requirements.js.map