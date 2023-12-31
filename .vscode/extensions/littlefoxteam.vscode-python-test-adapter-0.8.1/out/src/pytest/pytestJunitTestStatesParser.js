"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTestStates = void 0;
const tslib_1 = require("tslib");
const os_1 = require("os");
const path = tslib_1.__importStar(require("path"));
const xml2js = tslib_1.__importStar(require("xml2js"));
const collections_1 = require("../utilities/collections");
const fs_1 = require("../utilities/fs");
const strings_1 = require("../utilities/strings");
function parseTestStates(outputXmlFile, cwd) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const content = yield (0, fs_1.readFile)(outputXmlFile);
        const parseResult = yield parseXml(content);
        return parseTestResults(parseResult, cwd);
    });
}
exports.parseTestStates = parseTestStates;
function parseXml(content) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(content, (parseError, parserResult) => {
            if (parseError) {
                return reject(parseError);
            }
            resolve(parserResult);
        });
    });
}
function parseTestResults(parserResult, cwd) {
    if (!parserResult) {
        return [];
    }
    const testSuiteResults = parserResult.testsuites
        ? parserResult.testsuites.testsuite
        : [parserResult.testsuite];
    return testSuiteResults
        .map((testSuiteResult) => {
        if (!Array.isArray(testSuiteResult.testcase)) {
            return [];
        }
        return testSuiteResult.testcase
            .map((testcase) => mapToTestState(testcase, cwd))
            .filter((x) => x)
            .map((x) => x);
    })
        .reduce((r, x) => r.concat(x), []);
}
function mapToTestState(testcase, cwd) {
    const testId = buildTestName(cwd, testcase.$);
    if (!testId) {
        return undefined;
    }
    const [state, output, message, time] = getTestState(testcase);
    const decorations = getDecorations(state, testcase.$.line, message);
    return {
        state,
        test: testId,
        type: 'test',
        message: (0, strings_1.concatNonEmpty)(os_1.EOL + os_1.EOL, message, output),
        decorations,
        description: time ? `(${time}s)` : undefined,
    };
}
function getDecorations(state, line, message) {
    if (state === 'passed') {
        return [];
    }
    if (!line) {
        return [];
    }
    const lineNumber = parseInt(line, 10);
    return [
        {
            line: lineNumber,
            message,
        },
    ];
}
function getTestState(testcase) {
    const output = (0, strings_1.concatNonEmpty)(os_1.EOL, extractSystemOut(testcase), extractSystemErr(testcase));
    const executionTime = testcase.$.time;
    if (testcase.error) {
        return ['failed', output, extractErrorMessage(testcase.error), executionTime];
    }
    if (testcase.failure) {
        return ['failed', output, extractErrorMessage(testcase.failure), executionTime];
    }
    if (testcase.skipped) {
        return ['skipped', output, extractErrorMessage(testcase.skipped), executionTime];
    }
    return ['passed', '', output, executionTime];
}
function extractSystemOut(testcase) {
    return (0, collections_1.empty)(testcase['system-out']) ? '' : testcase['system-out'].join(os_1.EOL);
}
function extractSystemErr(testcase) {
    return (0, collections_1.empty)(testcase['system-err']) ? '' : testcase['system-err'].join(os_1.EOL);
}
function extractErrorMessage(errors) {
    if (!errors || !errors.length) {
        return '';
    }
    return (0, strings_1.concatNonEmpty)(os_1.EOL, ...errors.map((e) => (0, strings_1.concatNonEmpty)(os_1.EOL, e.$.message, e._)));
}
function buildTestName(cwd, test) {
    if (!test || !test.file || !test.name) {
        return undefined;
    }
    const module = path.resolve(cwd, test.file);
    if (!test.classname) {
        return `${module}`;
    }
    const testClass = test.classname
        .split('.')
        .filter((p) => p)
        .filter((p) => p !== '()')
        .join('.');
    const { matched, position } = matchModule(testClass, test.file);
    if (!matched) {
        return undefined;
    }
    const testClassParts = testClass
        .substring(position)
        .split('.')
        .filter((p) => p);
    if (testClassParts.length > 0) {
        return `${module}::${testClassParts.join('::')}::${test.name}`;
    }
    else {
        return `${module}::${test.name}`;
    }
}
function matchModule(testClass, testFile) {
    const { matched, position } = matchParentPath(testClass, testFile);
    if (!matched) {
        return { matched: false, position: -1 };
    }
    const { name, ext } = path.parse(testFile);
    if ((0, strings_1.startsWith)(testClass, name, position)) {
        let moduleEndPosition = position + name.length;
        if (ext && (0, strings_1.startsWith)(testClass, ext, moduleEndPosition)) {
            moduleEndPosition += ext.length;
        }
        if ((0, strings_1.startsWith)(testClass, '.', moduleEndPosition)) {
            moduleEndPosition += 1;
        }
        return { matched: true, position: moduleEndPosition };
    }
    return { matched: false, position: -1 };
}
function matchParentPath(testClass, testFile) {
    const parentPathToMatch = path.parse(testFile).dir;
    if (!parentPathToMatch) {
        return { matched: true, position: 0 };
    }
    const testFileParentPath = parentPathToMatch.split(path.sep);
    let index = 0;
    const allClassPartsMatchesPath = testFileParentPath.every((pathPart) => {
        if ((0, strings_1.startsWith)(testClass, pathPart + '.', index)) {
            index += pathPart.length + 1;
            return true;
        }
        return false;
    });
    return {
        matched: allClassPartsMatchesPath,
        position: index,
    };
}
//# sourceMappingURL=pytestJunitTestStatesParser.js.map