import * as fs from 'fs'
import { PACKAGE_JSON, ORGANIZATION_SYMBOL, NODE_MODULES, ErrorMessage } from './constants'

export const excludesRe = /^\./

export const packageNameRe = /(@\w*\/)?\w*$/

export function execRegEx (regEx: RegExp, str: string) {
    const matches = regEx.exec(str)
    return matches ? matches[0] : ''
}

interface PackageJson {
    name: string;
    version: string;
    description: string;
    dependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
}
export function getPackageJson (packagePath: string): PackageJson {
    try {
        const packageJsonPath = packagePath + `/${PACKAGE_JSON}`
        return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    } catch (err) {
        return {
            name: '',
            version: '0.0.0',
            description: ErrorMessage.PackageNotFound
        }
    }
}
export class PackageInfo {
    static create (packagePath: string, packageName = '') {
        packagePath = packagePath + (packageName && `/${packageName}`)

        const packageJson = getPackageJson(packagePath)
        const isExists = packageJson.description !== ErrorMessage.PackageNotFound
        packageJson.name = packageJson.name || execRegEx(packageNameRe, packagePath)

        return new PackageInfo({
            ...packageJson,
            path: isExists ? packagePath : ''
        })
    }

    name: string;
    version: string;
    path: string;
    description: string;

    get isExists () {
        return this.path !== ''
    }

    constructor (options: {
        name: string;
        version: string;
        path: string;
        description: string;
    }) {
        this.name = options.name
        this.path = options.path
        this.version = options.version
        this.description = options.description
    }
}

export function getPackageFolderPath (dirname: string) {
    return dirname + `/${NODE_MODULES}`
}

export function collectPackageInfos (packageFolderPath: string) {
    const packageInfos: PackageInfo[] = []
    fs.readdirSync(packageFolderPath).forEach(packageName => {
        const packagePath = packageFolderPath + `/${packageName}`
        if (packageName.indexOf(ORGANIZATION_SYMBOL) > -1) {
            packageInfos.push(...collectPackageInfos(packagePath))
        } else if (!excludesRe.test(packageName)) {
            const packageInfo = PackageInfo.create(packagePath)
            packageInfos.push(packageInfo)
        }
    })
    return packageInfos
}

export function getPackageInfosByDependencyFile (rootPath: string) {
    const packageJson = getPackageJson(rootPath)
    const packageFolderPath = getPackageFolderPath(rootPath)
    const devDependencies = packageJson.devDependencies || {}
    const dependencies = packageJson.dependencies || {}
    const packageInfos: PackageInfo[] = []

    Object.entries({
        ...dependencies,
        ...devDependencies
    }).forEach(([name, version]) => {
        const packageInfo = PackageInfo.create(packageFolderPath, name)
        if (!packageInfo.isExists) {
            packageInfo.version = version
        }
        packageInfos.push(packageInfo)
    })

    return packageInfos
}
