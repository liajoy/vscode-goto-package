# Goto Package

Jump to selected package.json file in node_modules quickly.

## It looks like this:

![ScreenshotJump](images/jump.gif)
![ScreenshotPick](images/pick.gif)

## Features

### Available Commands

- `Go to selected package` or the default shortcut `F12` to jump to the package.json file.
- `Visit page of npm` to jump to the package page of npm.
- `Pick and go to a package` to pick a package in select box then jump to the package.json file.

### Available Configuration

These packages in select box are the dependencies in the package.json by default, so those packages which is the dependence of dependence(--depth=2) are excluded, but you make it show.

``` json
    "GotoPackage.SearchNodeModules": true
```

## Change Log

See change log [here](https://github.com/liajoy/vscode-goto-package/blob/master/README.md).