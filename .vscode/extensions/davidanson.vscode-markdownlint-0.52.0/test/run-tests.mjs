import { runTests } from "@vscode/test-electron";

// @ts-ignore
const extensionDevelopmentPath = new URL("..", import.meta.url).pathname;
// @ts-ignore
const extensionTestsPath = new URL("./index.cjs", import.meta.url).pathname;

try {
  // @ts-ignore
  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
    "launchArgs": [
      "--disable-extensions"
      // Including "--extensionDevelopmentKind=web" causes the VS Code host to fail with:
      // TypeError: Failed to fetch
    ]
  });
} catch (error) {
  console.error(`TEST FAILURE: ${error}`);
  process.exit(1);
}
