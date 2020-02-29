import * as vscode from 'vscode'

import {
    ExtensionCommand, ErrorMessage, PACKAGES_QUICK_PICK_PLACEHOLDER, ACTIONS_QUICK_PICK_PLACEHOLDER, CONFIG_NAMESPACE
} from './constants'
import {
    PackageInfo, collectPackageInfos, getPackageInfosByDependencyFile, getPackageFolderPath
} from './utils'
import { Action, actions } from './actions'

function quickPickAcceptPromise (quickPick: vscode.QuickPick<vscode.QuickPickItem>) {
    return new Promise(quickPick.onDidAccept)
}

async function showActionsQuickPick (packageInfo: PackageInfo) {
    const actionsQuickPick = vscode.window.createQuickPick()
    actionsQuickPick.placeholder = ACTIONS_QUICK_PICK_PLACEHOLDER
    actionsQuickPick.items = actions

    actionsQuickPick.show()
    await quickPickAcceptPromise(actionsQuickPick)

    const activeItem = actionsQuickPick.activeItems[0]
    actionsQuickPick.hide()
    actionsQuickPick.dispose()

    await (activeItem as Action).exec(packageInfo)
}

async function showPackagesQuickPick (packageInfos: PackageInfo[]): Promise<PackageInfo> {
    const packagesQuickPick = vscode.window.createQuickPick()
    const PACKAGE_INFO_KEY = '__packageInfo__'
    const quickPickItems = packageInfos.map(packageInfo => ({
        label: packageInfo.name,
        detail: packageInfo.description,
        description: packageInfo.version,
        [PACKAGE_INFO_KEY]: packageInfo
    } as vscode.QuickPickItem))
    packagesQuickPick.placeholder = PACKAGES_QUICK_PICK_PLACEHOLDER
    packagesQuickPick.items = quickPickItems

    packagesQuickPick.show()
    await quickPickAcceptPromise(packagesQuickPick)

    const activeItem = packagesQuickPick.activeItems[0]
    const packageInfo = (activeItem as any)[PACKAGE_INFO_KEY]
    packagesQuickPick.hide()
    packagesQuickPick.dispose()

    return packageInfo
}

type Config = {
    searchNodeModules: boolean;
}
function getConfig (workspaceConfig: vscode.WorkspaceConfiguration) {
    const config: Config = workspaceConfig.get(CONFIG_NAMESPACE) || {} as Config
    return {
        searchNodeModules: config.searchNodeModules
    }
}

function handleError (err: Error) {
    vscode.window.showErrorMessage(err.message)
}

export const gotoPickPackageCommand = vscode.commands.registerCommand(
    ExtensionCommand.PickPackage,
    async () => {
        try {
            const { rootPath } = vscode.workspace
            if (!rootPath) {
                throw new Error(ErrorMessage.WorkspaceIsNotOpen)
            }

            const config = getConfig(vscode.workspace.getConfiguration())
            const packageFolderPath = getPackageFolderPath(rootPath)
            const packageInfos: PackageInfo[] = config.searchNodeModules
                ? collectPackageInfos(packageFolderPath)
                : getPackageInfosByDependencyFile(rootPath)

            const packageInfo = await showPackagesQuickPick(packageInfos)
            await showActionsQuickPick(packageInfo)
        } catch (err) {
            handleError(err)
        }
    }
)
