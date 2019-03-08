export enum ExtensionCommand {
    GOTO_PACKAGE = 'gotoPackage.gotoPackage',
    GOTO_NPM_PAGE = 'gotoPackage.gotoNpmPage',
    GOTO_PICK_PACKAGE = 'gotoPackage.gotoPickPackage'
}

export enum ErrorMessage {
    WORKSPACE_IS_NOT_OPEN = 'Please open a workspace.',
    PACKAGE_NOT_FOUND = 'This package can\'t be found in node_modules folder.',
    PACKAGE_INVALID = 'Content selected is not a package.'
}

export const NPM_URL = 'https://www.npmjs.com/package/';

export const PACKAGE_JSON = 'package.json';

export const NODE_MODULES = 'node_modules';

export const QUICK_PICK_PLACEHOLDER = 'Please pick a package which in your root node_modules';

export const ORGANIZATION_SYMBOL = '@';

export const DEPENDENCY_REGEX = /ependencies\": {/;

export const PACKAGE_NAME_REGEX = /\"(\S*)\": /;