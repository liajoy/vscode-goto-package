import * as vscode from 'vscode';

import { GOTO_PACKAGE_COMMAND, GOTO_NPM_PAGE_COMMAND, PACKAGE_NOT_FOUND, NPM_URL } from './constants';
import { getPackagePathByLine, getPackageNameByLine } from './fileManager';

export const gotoPackageCommand = vscode.commands.registerTextEditorCommand(
    GOTO_PACKAGE_COMMAND,
    async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, lineNumber: number) => {
        try {
            const { packagePath } = await checkPackageSelected(textEditor, lineNumber);

            await vscode.window.showTextDocument(
                vscode.Uri.file(packagePath),
                { preview: false }
            );
            vscode.commands.executeCommand(
                'workbench.files.action.showActiveFileInExplorer'
            );
        }
        catch(err) {
            handleError(err);
        }
    }
);

export const gotoNpmPageCommand = vscode.commands.registerTextEditorCommand(
    GOTO_NPM_PAGE_COMMAND,
    async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, lineNumber: number) => {
        try {
            const { packageName } = await checkPackageSelected(textEditor, lineNumber);

            vscode.commands.executeCommand(
                'vscode.open',
                vscode.Uri.parse(`${NPM_URL}${packageName}`)
            );
        }
        catch(err) {
            handleError(err);
        }
    }
);


function checkPackageSelected(
    textEditor: vscode.TextEditor,
    lineNumber: number,
) {
    const document = textEditor.document;
    const line = lineNumber || textEditor.selection.anchor.line || 0;

    let packageName = getPackageNameByLine(document, line);
    let packagePath = getPackagePathByLine(document, line);

    if (packagePath) {
        return Promise.resolve({
            packageName,
            packagePath
        });
    }

    return Promise.reject(new Error(PACKAGE_NOT_FOUND));
}

function handleError(err: Error) {
    vscode.window.showErrorMessage(err.message);
}