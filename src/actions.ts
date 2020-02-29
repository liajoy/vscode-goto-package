import * as vscode from 'vscode'
import { PackageInfo } from './utils'
import { PACKAGE_JSON, NPM_URL } from './constants'

export class Action {
    label: string
    func: (packageInfo: PackageInfo) => void

    constructor (label: string, func: (packageInfo: PackageInfo) => void) {
        this.label = label
        this.func = func
    }

    exec (packageInfo: PackageInfo) {
        return this.func(packageInfo)
    }
}

export async function openAndLocateFile (dirname: string) {
    const filePath = dirname + '/' + PACKAGE_JSON
    await vscode.window.showTextDocument(
        vscode.Uri.file(filePath),
        { preview: false }
    )
    vscode.commands.executeCommand(
        'workbench.files.action.showActiveFileInExplorer'
    )
}

export function openManagerPage (packageName: string) {
    const url = NPM_URL + packageName
    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(url)
    )
}

export const actions = [
    new Action('go to package.json', packageInfo => openAndLocateFile(packageInfo.path)),
    new Action('go to npm page', packageInfo => openManagerPage(packageInfo.name))
]
