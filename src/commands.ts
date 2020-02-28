import * as vscode from 'vscode'

import {
    ExtensionCommand, ErrorMessage, NPM_URL, PACKAGE_JSON, QUICK_PICK_PLACEHOLDER, NODE_MODULES
} from './constants'
import {
    getPackageLines, getPackageNameByLine, getPackagePathByLine, openAndLocateFile, openBrowserPage, getPackagesNameDeeply, getPackageJSON, handleError
} from './utils'

export const gotoPackageCommand = vscode.commands.registerTextEditorCommand(
    ExtensionCommand.GOTO_PACKAGE,
    async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, lineNumber: number) => {
        try {
            const { document } = textEditor
            const line = lineNumber || textEditor.selection.anchor.line || 0
            const packagePath = getPackagePathByLine(document, line)

            if (packagePath) {
                openAndLocateFile(packagePath)
            } else {
                throw new Error(ErrorMessage.PACKAGE_NOT_FOUND)
            }
        } catch (err) {
            handleError(err)
        }
    }
)

export const gotoNpmPageCommand = vscode.commands.registerTextEditorCommand(
    ExtensionCommand.GOTO_NPM_PAGE,
    async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, lineNumber: number) => {
        try {
            const { document } = textEditor
            const line = lineNumber || textEditor.selection.anchor.line || 0
            const packageName = getPackageNameByLine(document, line)

            if (packageName) {
                openBrowserPage(`${NPM_URL}${packageName}`)
            } else {
                throw new Error(ErrorMessage.PACKAGE_NOT_FOUND)
            }
        } catch (err) {
            handleError(err)
        }
    }
)

export const gotoPickPackageCommand = vscode.commands.registerCommand(
    ExtensionCommand.GOTO_PICK_PACKAGE,
    async () => {
        try {
            const { rootPath } = vscode.workspace
            const searchNodeModules = vscode.workspace.getConfiguration().get('searchNodeModules')

            if (rootPath) {
                const packagesPath: { [key: string]: string } = {}
                let packagesName: null|string[] = null

                if (searchNodeModules) {
                    const nodeModulesPath = `${rootPath}/${NODE_MODULES}`

                    packagesName = getPackagesNameDeeply(nodeModulesPath)
                    packagesName.forEach((packageName) => {
                        packagesPath[packageName] = `${nodeModulesPath}/${getPackageJSON(packageName)}`
                    })
                } else {
                    const packagePath = `${rootPath}/${PACKAGE_JSON}`
                    const document = await vscode.workspace.openTextDocument(
                        vscode.Uri.file(packagePath)
                    )

                    packagesName = getPackageLines(document)
                        .reduce((packagesName, line) => {
                            const packageName = getPackageNameByLine(document, line.lineNumber)

                            if (packageName) {
                                const packagePath = getPackagePathByLine(document, line.lineNumber)
                                packagesName.push(packageName)
                                packagesPath[packageName] = packagePath
                            }

                            return packagesName
                        }, [] as string[])
                }

                const quickPickItems = (packagesName as string[]).map((packageName) => ({
                    label: packageName,
                    detail: packagesPath[packageName] ? '' : ErrorMessage.PACKAGE_NOT_FOUND
                } as vscode.QuickPickItem))

                const quickPick = vscode.window.createQuickPick()
                quickPick.items = quickPickItems
                quickPick.placeholder = QUICK_PICK_PLACEHOLDER

                quickPick.onDidAccept(async () => {
                    const packagePicked = quickPick.activeItems[0]
                    const isPackageExist = !packagePicked.detail

                    if (isPackageExist) {
                        const packageName = packagePicked.label

                        openAndLocateFile(packagesPath[packageName])
                        quickPick.hide()
                        quickPick.dispose()
                    } else {
                        handleError(new Error(ErrorMessage.PACKAGE_NOT_FOUND))
                    }
                })
                quickPick.show()
            } else {
                throw new Error(ErrorMessage.WORKSPACE_IS_NOT_OPEN)
            }
        } catch (err) {
            handleError(err)
        }
    }
)
