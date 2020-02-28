import * as vscode from 'vscode'

import * as fs from 'fs'
import * as path from 'path'
import {
    PACKAGE_JSON, ORGANIZATION_SYMBOL, DEPENDENCY_REGEX, PACKAGE_NAME_REGEX, NODE_MODULES
} from './constants'

export function isDependency (text: string) {
    return DEPENDENCY_REGEX.test(text)
}

export function getPackageNameByLine (document: vscode.TextDocument, lineNumber: number) {
    const line = document.lineAt(lineNumber)
    const { text } = line
    const matches = PACKAGE_NAME_REGEX.exec(text)

    if (!matches || !matches.length) {
        return null
    }

    return matches[1]
}

export function getPackageJSON (packageName: string) {
    return `${packageName}/${PACKAGE_JSON}`
}

export function getPackagePathByLine (document: vscode.TextDocument, lineNumber: number) {
    const packageName = getPackageNameByLine(document, lineNumber)
    const dirname = path.dirname(document.fileName)

    if (packageName) {
        const path = `${dirname}/${NODE_MODULES}/${getPackageJSON(packageName)}`

        if (fs.existsSync(path)) {
            return path
        }
    }

    return null
}

export function getPackageLines (document: vscode.TextDocument) {
    let isLineInDependencyScope = false

    return new Array(document.lineCount).fill('')
        .map((line, idx) => document.lineAt(idx))
        .filter((line) => {
            const { text } = line

            if (isDependency(text)) {
                isLineInDependencyScope = true
                return false
            }
            if (isLineInDependencyScope && /},?/.test(text)) {
                isLineInDependencyScope = false
            }

            return isLineInDependencyScope
        })
}

export async function openAndLocateFile (filePath: string) {
    await vscode.window.showTextDocument(
        vscode.Uri.file(filePath),
        { preview: false }
    )
    vscode.commands.executeCommand(
        'workbench.files.action.showActiveFileInExplorer'
    )
}

export function openBrowserPage (url: string) {
    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(url)
    )
}

export function getPackagesNameDeeply (nodeModulesPath: string, _prefix = ''): string[] {
    let packagesName: string[] = []

    fs.readdirSync(nodeModulesPath).forEach((file) => {
        if (file.indexOf(ORGANIZATION_SYMBOL) > -1) {
            packagesName = packagesName.concat(
                getPackagesNameDeeply(`${nodeModulesPath}/${file}`, `${file}/`)
            )
        } else {
            packagesName.push(`${_prefix}${file}`)
        }
    })

    return packagesName
}

export function handleError (err: Error) {
    vscode.window.showErrorMessage(err.message)
}
