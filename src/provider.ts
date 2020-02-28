import * as vscode from 'vscode'

import { getPackagePathByLine, getPackageLines } from './utils'
import { ExtensionCommand } from './constants'

export default class CodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses (
        document: vscode.TextDocument
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        return getPackageLines(document)
            .filter((line) => getPackagePathByLine(document, line.lineNumber))
            .map((line) => new vscode.CodeLens(
                line.range,
                {
                    title: 'go to package',
                    command: ExtensionCommand.GOTO_PACKAGE,
                    arguments: [line.lineNumber]
                }
            ))
    }
}
