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
exports.expand = exports.downloadAndExpandJava = exports.getJavaOrDownload = exports.getExpectedJavaExecutableLocation = exports.getExpectedJavaDirLocation = exports.download = void 0;
const vscode_1 = require("vscode");
const channel_1 = require("./channel");
const requestLight_1 = require("./requestLight");
const time_1 = require("./time");
const fs = require("fs");
const path = require("path");
const tar = require("tar");
const unzipper = require("unzipper");
const os_1 = require("os");
const files_1 = require("./files");
const requirements_1 = require("./requirements");
function download(url, progress, token, location) {
    return __awaiter(this, void 0, void 0, function* () {
        // Downloads can go wrong (so, retry a few times before giving up).
        const maxTries = 3;
        let timing = new time_1.Timing();
        channel_1.OUTPUT_CHANNEL.appendLine("Downloading from: " + url);
        for (let i = 0; i < maxTries; i++) {
            function onProgress(currLen, totalLen) {
                if (timing.elapsedFromLastMeasurement(300) || currLen == totalLen) {
                    currLen /= 1024 * 1024;
                    totalLen /= 1024 * 1024;
                    let currProgress = (currLen / totalLen) * 100;
                    let msg = "Downloaded: " +
                        currLen.toFixed(1) +
                        "MB of " +
                        totalLen.toFixed(1) +
                        "MB (" +
                        currProgress.toFixed(1) +
                        "%)";
                    if (i > 0) {
                        msg = "Attempt: " + (i + 1) + " - " + msg;
                    }
                    progress.report({ message: msg });
                    channel_1.OUTPUT_CHANNEL.appendLine(msg);
                }
            }
            try {
                let response = yield (0, requestLight_1.xhr)({
                    url: url,
                    onProgress: onProgress,
                });
                if (response.status == 200) {
                    // Ok, we've been able to get it.
                    // Note: only write to file after we get all contents to avoid
                    // having partial downloads.
                    channel_1.OUTPUT_CHANNEL.appendLine("Finished downloading in: " + timing.getTotalElapsedAsStr());
                    channel_1.OUTPUT_CHANNEL.appendLine("Writing to: " + location);
                    progress.report({
                        message: "Finished downloading (writing to file).",
                    });
                    let s = fs.createWriteStream(location, {
                        encoding: "binary",
                        mode: 0o744,
                    });
                    try {
                        response.responseData.forEach((element) => {
                            s.write(element);
                        });
                    }
                    finally {
                        s.close();
                    }
                    // If we don't sleep after downloading, the first activation seems to fail on Windows and Mac
                    // (EBUSY on Windows, undefined on Mac).
                    yield (0, time_1.sleep)(200);
                    return location;
                }
                else {
                    throw Error("Unable to download from " +
                        url +
                        ". Response status: " +
                        response.status +
                        "Response message: " +
                        response.responseText);
                }
            }
            catch (error) {
                channel_1.OUTPUT_CHANNEL.appendLine("Error downloading (" + i + " of " + maxTries + "). Error: " + error.message);
                if (i == maxTries - 1) {
                    return undefined;
                }
            }
        }
    });
}
exports.download = download;
function getExpectedJavaDirLocation() {
    return path.join((0, os_1.homedir)(), ".pydev_vscode", "java19");
}
exports.getExpectedJavaDirLocation = getExpectedJavaDirLocation;
function getExpectedJavaExecutableLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        switch (process.platform) {
            case "win32":
                return path.join(getExpectedJavaDirLocation(), "jdk-19.0.2+7-jre", "bin", "java.exe");
            case "darwin":
                if (process.arch === "x64") {
                    return path.join(getExpectedJavaDirLocation(), "jdk-19.0.2+7-jre", "Contents", "Home", "bin", "java");
                }
                else {
                    return path.join(getExpectedJavaDirLocation(), "jdk-19.0.2+7-jre", "Contents", "Home", "bin", "java");
                }
            case "linux":
                return path.join(getExpectedJavaDirLocation(), "jdk-19.0.2+7-jre", "bin", "java");
            default:
                throw new Error(`Unsupported platform: ${process.platform}`);
        }
    });
}
exports.getExpectedJavaExecutableLocation = getExpectedJavaExecutableLocation;
function getJavaOrDownload() {
    return __awaiter(this, void 0, void 0, function* () {
        let javaExeLocation = yield getExpectedJavaExecutableLocation();
        let exists = yield (0, files_1.fileExists)(javaExeLocation);
        let version;
        if (exists) {
            try {
                version = yield (0, requirements_1.checkJavaVersion)(javaExeLocation);
            }
            catch (err) {
                (0, channel_1.logError)("Error checking java version", err);
                exists = false;
            }
        }
        if (exists) {
            return {
                java_executable: javaExeLocation,
                java_version: version,
            };
        }
        return yield vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "Download java.",
            cancellable: false,
        }, downloadAndExpandJava);
    });
}
exports.getJavaOrDownload = getJavaOrDownload;
function downloadAndExpandJava(progress, token) {
    return __awaiter(this, void 0, void 0, function* () {
        // Returns the java.exe location (this will actually download java and expand it).
        const platform = process.platform;
        let url;
        switch (platform) {
            case "win32":
                url = `https://github.com/adoptium/temurin19-binaries/releases/download/jdk-19.0.2%2B7/OpenJDK19U-jre_x64_windows_hotspot_19.0.2_7.zip`;
                break;
            case "darwin":
                if (process.arch === "x64") {
                    url = `https://github.com/adoptium/temurin19-binaries/releases/download/jdk-19.0.2%2B7/OpenJDK19U-jre_aarch64_mac_hotspot_19.0.2_7.tar.gz`;
                }
                else {
                    url = `https://github.com/adoptium/temurin19-binaries/releases/download/jdk-19.0.2%2B7/OpenJDK19U-jre_x64_mac_hotspot_19.0.2_7.tar.gz`;
                }
                break;
            case "linux":
                url = `https://github.com/adoptium/temurin19-binaries/releases/download/jdk-19.0.2%2B7/OpenJDK19U-jre_x64_linux_hotspot_19.0.2_7.tar.gz`;
                break;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
        // Configure library with http settings.
        // i.e.: https://code.visualstudio.com/docs/setup/network
        let httpSettings = vscode_1.workspace.getConfiguration("http");
        (0, requestLight_1.configure)(httpSettings.get("proxy"), httpSettings.get("proxyStrictSSL"));
        const base = path.basename(url);
        const javaDirLocation = getExpectedJavaDirLocation();
        yield (0, files_1.makeDirs)(javaDirLocation);
        const zippedFile = path.join(javaDirLocation, base);
        const finalLoc = yield download(url, progress, token, zippedFile);
        if (!finalLoc) {
            throw new Error("It was not possible to download java. See the OUTPUT view > PyDev for details.");
        }
        progress.report({ message: "Expanding contents of download." });
        yield expand(zippedFile, javaDirLocation);
        const javaExeLocation = yield getExpectedJavaExecutableLocation();
        progress.report({ message: "Verifying downloaded java executable." });
        return {
            java_executable: javaExeLocation,
            java_version: yield (0, requirements_1.checkJavaVersion)(javaExeLocation),
        };
    });
}
exports.downloadAndExpandJava = downloadAndExpandJava;
function expand(archivePath, extractDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let stream;
        if (archivePath.endsWith(".tar.gz")) {
            stream = fs.createReadStream(archivePath).pipe(tar.x({ cwd: extractDir }));
        }
        else if (archivePath.endsWith(".zip")) {
            stream = fs.createReadStream(archivePath).pipe(unzipper.Extract({ path: extractDir }));
        }
        else {
            throw new Error(`Unsupported archive format: ${archivePath}`);
        }
        yield new Promise((resolve, reject) => {
            stream.on("finish", () => {
                channel_1.OUTPUT_CHANNEL.appendLine(`Extracted ${archivePath} to ${extractDir}`);
                resolve();
            });
            stream.on("error", (err) => {
                (0, channel_1.logError)(`Error extracting: ${archivePath} to ${extractDir}`, err);
                reject(err);
            });
        });
    });
}
exports.expand = expand;
//# sourceMappingURL=download.js.map