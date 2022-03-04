import packageJson from 'package-json';
import { PackageInfo } from './package-info';

export interface NodePackageInfo extends PackageInfo {
    latest: string;
    description: string;
    repository: string,
    license: string,
    homepage: string,
    id: string
}

export async function getPackagesInfo(packages: PackageInfo[]): Promise<NodePackageInfo[]> {
    const infoes: NodePackageInfo[] = [];
    for (const pack of packages) {
        const meta = await getMeta(pack);
        if (meta) {
            infoes.push(meta);
        }
    }
    return infoes;
}

async function getMeta(packageInfo: PackageInfo): Promise<NodePackageInfo> {
    try {
        console.log(`GET ${packageInfo.name}`)
        const meta = await packageJson(packageInfo.name, { fullMetadata: true })

        return {
            ...packageInfo,
            latest: meta.version as string,
            description: meta.description,
            repository: meta.repository ? meta.repository.url : '',
            license: meta.license,
            id: meta._id,
            homepage: meta.homepage
        }
    } catch (err) {
        console.warn(`failed to get info from npm registry for package "${packageInfo.name}": ${err}`)
    }
}