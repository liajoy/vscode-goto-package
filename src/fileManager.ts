import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_JSON_REGEX = /\/package\.json$/;
const DEPENDENCY_REGEX = /ependencies\": {/;
const PACKAGE_NAME_REGEX = /\"(\S*)\": /;

export function isDependency(text: string) {
    return DEPENDENCY_REGEX.test(text);
}

export function isPackageJson(fileName: string) {
    return PACKAGE_JSON_REGEX.test(fileName);
}

export function getPackagePath(document:vscode.TextDocument, packageName: string | null) {
    const dirname = path.dirname(document.fileName);

    if(packageName) {
        const path = `${dirname}/node_modules/${packageName}/package.json`;

        if(fs.existsSync(path)) {
            return path;
        }
    }

    return null;
}

export function getPackageNameByLine(document: vscode.TextDocument, lineNumber: number) {
    const line = document.lineAt(lineNumber);
    const text = line.text;
    const matches = PACKAGE_NAME_REGEX.exec(text);

    if (!matches || !matches.length) {
      return null;
    }

    return matches[1];
}

export function getPackagePathByLine(document: vscode.TextDocument, lineNumber: number) {
    const packageName = getPackageNameByLine(document, lineNumber);

    return getPackagePath(document, packageName);
}

