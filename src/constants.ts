export enum ExtensionCommand {
    PickPackage = 'GotoPackage.pickPackage',
}

export enum ErrorMessage {
    WorkspaceIsNotOpen = 'Please open a workspace.',
    PackageNotFound = 'This package can\'t be found in node_modules folder.',
}

export const NPM_URL = 'https://www.npmjs.com/package/'

export const PACKAGE_JSON = 'package.json'

export const NODE_MODULES = 'node_modules'

export const PACKAGES_QUICK_PICK_PLACEHOLDER = 'Please pick a package.'

export const ACTIONS_QUICK_PICK_PLACEHOLDER = 'Please pick a action.'

export const ORGANIZATION_SYMBOL = '@'

export const WORKSPACE = 'workspaces'

export const CONFIG_NAMESPACE = 'gotoPackage'
