import * as vscode from 'vscode';

import { isDependency, getPackagePathByLine } from './fileManager';
import { GOTO_PACKAGE_COMMAND } from './constants';
export default class CodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        let isLineInDependencyScope = false;

        return new Array(document.lineCount).fill('')
        .map((line, idx) => document.lineAt(idx))
        .filter(line => {
            const { text } = line;

            if(isDependency(text)) {
                isLineInDependencyScope = true;
                return false;
            }
            if(isLineInDependencyScope && /},?/.test(text)) {
                isLineInDependencyScope = false;
            }

            return isLineInDependencyScope;
        })
        .filter(line => getPackagePathByLine(document, line.lineNumber))
        .map(line => {
            return new vscode.CodeLens(
                line.range,
                {
                    title: 'go to package',
                    command: GOTO_PACKAGE_COMMAND,
                    arguments: [line.lineNumber],
                }
            );
        });
    }
}