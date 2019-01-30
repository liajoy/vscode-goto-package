import * as vscode from 'vscode';

import CodeLensProvider from './provider';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            'json',
            new CodeLensProvider()
        )
    );

    Object.values(commands).forEach(command => {
        context.subscriptions.push(command);
    });
}