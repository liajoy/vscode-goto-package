import * as vscode from 'vscode'

import * as commands from './commands'

export function activate (context: vscode.ExtensionContext) {
    Object.values(commands).forEach((command) => {
        context.subscriptions.push(command)
    })
}
