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
exports.startContinuePythonServer = exports.downloadFromS3 = exports.getExtensionVersion = exports.devDataPath = exports.getContinueGlobalPath = void 0;
const vscode_1 = require("../util/vscode");
const util_1 = require("util");
const child_process_1 = require("child_process");
const child_process_2 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const bridge_1 = require("../bridge");
const node_fetch_1 = __importDefault(require("node-fetch"));
const vscode = __importStar(require("vscode"));
const os = __importStar(require("os"));
const fkill_1 = __importDefault(require("fkill"));
const promises_1 = require("stream/promises");
const request = require("request");
const extension_1 = require("../extension");
const exec = (0, util_1.promisify)(child_process_1.exec);
async function runCommand(cmd) {
    var stdout = "";
    var stderr = "";
    try {
        var { stdout, stderr } = await exec(cmd, {
            shell: process.platform === "win32" ? "powershell.exe" : undefined,
        });
    }
    catch (e) {
        stderr = e.stderr;
        stdout = e.stdout;
    }
    const stderrOrUndefined = stderr === "" ? undefined : stderr;
    return [stdout, stderrOrUndefined];
}
async function checkServerRunning(serverUrl) {
    // Check if already running by calling /health
    try {
        const response = await (0, node_fetch_1.default)(`${serverUrl}/health`);
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
function getContinueGlobalPath() {
    // This is ~/.continue on mac/linux
    const continuePath = path.join(os.homedir(), ".continue");
    if (!fs.existsSync(continuePath)) {
        fs.mkdirSync(continuePath);
    }
    return continuePath;
}
exports.getContinueGlobalPath = getContinueGlobalPath;
function serverPath() {
    const sPath = path.join(getContinueGlobalPath(), "server");
    if (!fs.existsSync(sPath)) {
        fs.mkdirSync(sPath);
    }
    return sPath;
}
function devDataPath() {
    const sPath = path.join(getContinueGlobalPath(), "dev_data");
    if (!fs.existsSync(sPath)) {
        fs.mkdirSync(sPath);
    }
    return sPath;
}
exports.devDataPath = devDataPath;
function serverVersionPath() {
    return path.join(serverPath(), "server_version.txt");
}
function serverBinaryPath() {
    return path.join(serverPath(), "exe", `run${os.platform() === "win32" ? ".exe" : ""}`);
}
function getExtensionVersion() {
    const extension = vscode.extensions.getExtension("continue.continue");
    return extension?.packageJSON.version || "";
}
exports.getExtensionVersion = getExtensionVersion;
// Returns whether a server of the current version is already running
async function checkOrKillRunningServer(serverUrl, deleteBinary) {
    const serverRunning = await checkServerRunning(serverUrl);
    let shouldKillAndReplace = true;
    if (fs.existsSync(serverVersionPath())) {
        const serverVersion = fs.readFileSync(serverVersionPath(), "utf8");
        if (serverVersion === getExtensionVersion() && serverRunning) {
            // The current version is already up and running, no need to continue
            console.log("Continue server of correct version already running");
            shouldKillAndReplace = false;
        }
    }
    // Kill the server if it is running an old version
    if (shouldKillAndReplace) {
        console.log("Killing server from old version of Continue");
        try {
            await (0, fkill_1.default)(":65432", { force: true });
        }
        catch (e) {
            if (!e.message.includes("Process doesn't exist")) {
                console.log("Failed to kill old server:", e);
                // Try again, on Windows. This time with taskkill
                if (os.platform() === "win32") {
                    try {
                        await runCommand(`taskkill /F /IM run.exe`);
                    }
                    catch (e) {
                        console.log("Failed to kill old server second time on windows with taskkill:", e);
                    }
                }
            }
        }
        if (fs.existsSync(serverVersionPath())) {
            fs.unlinkSync(serverVersionPath());
        }
        if (deleteBinary) {
            // Optionally, delete the server binary
            const serverBinary = serverBinaryPath();
            if (fs.existsSync(serverBinary)) {
                fs.unlinkSync(serverBinary);
            }
        }
    }
    return serverRunning && !shouldKillAndReplace;
}
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
function isPreviewExtension() {
    // If the extension minor version is odd, it is a preview version
    const extensionVersion = getExtensionVersion();
    if (!extensionVersion || extensionVersion === "") {
        return false;
    }
    const extensionVersionSplit = extensionVersion.split(".");
    const extensionMinorVersion = extensionVersionSplit[1];
    return parseInt(extensionMinorVersion) % 2 === 1;
}
async function downloadFromS3(bucket, fileName, destination, region, useBackupUrl = false) {
    ensureDirectoryExistence(destination);
    const file = fs.createWriteStream(destination);
    const download = request({
        url: useBackupUrl
            ? `https://s3.continue.dev/${fileName}`
            : `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`,
    });
    return new Promise(async (resolve, reject) => {
        const handleErr = () => {
            if (fs.existsSync(destination)) {
                fs.unlink(destination, () => { });
            }
        };
        download.on("response", (response) => {
            if (response.statusCode !== 200) {
                handleErr();
                reject(new Error("No body returned when downloading from S3 bucket"));
            }
        });
        download.on("error", (err) => {
            handleErr();
            reject(err);
        });
        download.pipe(file);
        await (0, promises_1.finished)(download);
        resolve(null);
    });
}
exports.downloadFromS3 = downloadFromS3;
function includedBinaryPath() {
    const extensionPath = (0, vscode_1.getExtensionUri)().fsPath;
    return path.join(extensionPath, "exe", `run${os.platform() === "win32" ? ".exe" : ""}`);
}
function runExecutable(path) {
    console.log("---- Starting Continue server ----");
    let attempts = 0;
    let maxAttempts = 5;
    let delay = 1000; // Delay between each attempt in milliseconds
    const spawnChild = () => {
        const retry = (e) => {
            attempts++;
            console.log(`Error caught: ${e}.\n\nRetrying attempt ${attempts}...`);
            setTimeout(spawnChild, delay);
        };
        try {
            // NodeJS bug requires not using detached on Windows, otherwise windowsHide is ineffective
            // Otherwise, detach is preferable
            const windowsSettings = {
                windowsHide: true,
            };
            const macLinuxSettings = {
                detached: true,
                stdio: "ignore",
            };
            const settings = os.platform() === "win32" ? windowsSettings : macLinuxSettings;
            // Spawn the server
            const child = (0, child_process_2.spawn)(path, settings);
            // Either unref to avoid zombie process, or listen to events because you can
            if (os.platform() === "win32") {
                child.stdout.on("data", (data) => {
                    console.log(`stdout: ${data}`);
                });
                child.stderr.on("data", (data) => {
                    console.log(`stderr: ${data}`);
                });
                child.on("error", (err) => {
                    if (attempts < maxAttempts) {
                        retry(err);
                    }
                    else {
                        console.error("Failed to start subprocess.", err);
                    }
                });
                child.on("exit", (code, signal) => {
                    console.log("Subprocess exited with code", code, signal);
                });
                child.on("close", (code, signal) => {
                    console.log("Subprocess closed with code", code, signal);
                });
            }
            else {
                child.unref();
            }
        }
        catch (e) {
            if (attempts < maxAttempts) {
                retry(e);
            }
            else {
                throw e;
            }
        }
    };
    spawnChild();
    // Write the current version of vscode extension to a file called server_version.txt
    fs.writeFileSync(serverVersionPath(), getExtensionVersion());
}
async function setupWithS3Download(redownload, serverUrl) {
    // Check if server is already running
    if (redownload && (await checkOrKillRunningServer(serverUrl, true))) {
        console.log("Continue server already running");
        return;
    }
    // Download the server executable
    const bucket = "continue-server-binaries";
    const fileName = os.platform() === "win32"
        ? "windows/run.exe"
        : os.platform() === "darwin"
            ? os.arch() === "arm64"
                ? "apple-silicon/run"
                : "mac/run"
            : "linux/run";
    const destination = serverBinaryPath();
    // First, check if the server is already downloaded
    let shouldDownload = true;
    if (fs.existsSync(destination) && redownload) {
        // Check if the server is the correct version
        if (fs.existsSync(serverVersionPath())) {
            const serverVersion = fs.readFileSync(serverVersionPath(), "utf8");
            if (serverVersion === getExtensionVersion()) {
                // The current version is already up and running, no need to continue
                console.log("Continue server already downloaded");
                shouldDownload = false;
            }
            else {
                console.log("Old version of the server downloaded");
                if (fs.existsSync(destination)) {
                    fs.unlinkSync(destination);
                }
            }
        }
        else {
            console.log("Old version of the server downloaded");
            if (fs.existsSync(destination)) {
                fs.unlinkSync(destination);
            }
        }
    }
    if (shouldDownload && redownload) {
        let timeout = setTimeout(() => {
            vscode.window.showErrorMessage(`It looks like the Continue server is taking a while to download. If this persists, you can manually download the binary or run it from source: https://continue.dev/docs/troubleshooting#run-the-server-manually.`);
        }, 35000);
        let download = vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Installing Continue server...",
            cancellable: false,
        }, async () => {
            try {
                await downloadFromS3(bucket, `${isPreviewExtension() ? "preview/" : ""}${fileName}`, destination, "us-west-1", false);
            }
            catch (e) {
                console.log("Failed to download from primary url, trying backup url");
                (0, extension_1.capture)({
                    distinctId: (0, vscode_1.getUniqueId)(),
                    event: "first_binary_download_failed",
                    properties: {
                        extensionVersion: getExtensionVersion(),
                        os: os.platform(),
                        arch: os.arch(),
                        error_msg: e.message,
                    },
                });
                try {
                    await downloadFromS3(bucket, `${isPreviewExtension() ? "preview/" : ""}${fileName}`, destination, "us-west-1", true);
                }
                catch (e) {
                    (0, extension_1.capture)({
                        distinctId: (0, vscode_1.getUniqueId)(),
                        event: "second_binary_download_failed",
                        properties: {
                            extensionVersion: getExtensionVersion(),
                            os: os.platform(),
                            arch: os.arch(),
                            error_msg: e.message,
                        },
                    });
                    throw e;
                }
            }
        });
        try {
            await download;
            console.log("Downloaded server executable at ", destination);
            clearTimeout(timeout);
        }
        catch (e) {
            const errText = `Failed to download Continue server from S3: ${e}`;
            vscode.window.showErrorMessage(errText);
        }
    }
    // Get name of the corresponding executable for platform
    if (os.platform() === "darwin") {
        // Add necessary permissions
        fs.chmodSync(destination, 493);
        await runCommand(`xattr -dr com.apple.quarantine ${destination}`);
    }
    else if (os.platform() === "linux") {
        // Add necessary permissions
        fs.chmodSync(destination, 493);
    }
    // Validate that the file exists
    console.log("Looking for file at ", destination);
    if (!fs.existsSync(destination)) {
        // List the contents of the folder
        const files = fs.readdirSync(path.join((0, vscode_1.getExtensionUri)().fsPath, "server", "exe"));
        console.log("Files in server folder: ", files);
        const errText = `- Failed to install Continue server.`;
        vscode.window.showErrorMessage(errText);
        console.log("6: throwing error message: ", errText);
        throw new Error(errText);
    }
    // Run the executable
    runExecutable(destination);
}
async function startContinuePythonServer(redownload = true) {
    // Check vscode settings for whether server is being run manually
    const manuallyRunningServer = vscode.workspace
        .getConfiguration("continue")
        .get("manuallyRunningServer") || false;
    const serverUrl = (0, bridge_1.getContinueServerUrl)();
    if ((serverUrl !== "http://localhost:65432" &&
        serverUrl !== "http://127.0.0.1:65432") ||
        manuallyRunningServer) {
        console.log("Continue server is being run manually, skipping start");
        return;
    }
    // If on Apple Silicon, download binary from S3
    // const isAppleSilicon = os.platform() === "darwin" && os.arch() === "arm64";
    // if (isAppleSilicon) {
    //   await setupWithS3Download(redownload, serverUrl);
    //   return;
    // }
    // Check if current server version is already running
    if (redownload && (await checkOrKillRunningServer(serverUrl, false))) {
        console.log("Continue server already running");
        return;
    }
    // Otherwise, use the binary installed with the extension
    if (!fs.existsSync(includedBinaryPath())) {
        throw new Error(`Continue server binary not found at ${includedBinaryPath()}`);
    }
    runExecutable(includedBinaryPath());
}
exports.startContinuePythonServer = startContinuePythonServer;
//# sourceMappingURL=environmentSetup.js.map