import * as vscode from 'vscode';

import CodeLensProvider from './provider';
import { getPackagePathByLine } from './fileManager';

export const FILE_TYPE = 'json';
export const COMMAND_NAME = 'gotoPackage.gotoPackage';
export const ERROR_MSG = 'Package no found.';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            FILE_TYPE,
            new CodeLensProvider()
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('goto.helloWorld', () => {
            vscode.window.showInformationMessage('hello world');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(
        COMMAND_NAME,
        async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, lineNumber: number) => {
            const document = textEditor.document;
            const line = lineNumber || textEditor.selection.anchor.line || 0;

            let packagePath = getPackagePathByLine(document, line);

            if (packagePath) {
                await vscode.window.showTextDocument(
                    vscode.Uri.file(packagePath),
                    { preview: false }
                );

                vscode.commands.executeCommand(
                    'workbench.files.action.showActiveFileInExplorer'
                );
            }
            else {
                vscode.window.showErrorMessage(ERROR_MSG);
            }
        })
    );
}