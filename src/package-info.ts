import { promises as fsPromises } from 'fs';

export interface PackageInfo {
    name: string;
    version: string;
}

export async function readPackages(path): Promise<PackageInfo[]> {
    const content = await fsPromises.readFile(path, 'utf8');
    const json = JSON.parse(content);
    if (!json.dependencies) {
        return [];
    }
    const dependencies: Record<string, unknown> = json.dependencies;

    const packages: PackageInfo[] = [];

    for (const name in dependencies) {
        const version: string = (dependencies[name] as string).replace(/^(\^|~)/, '');
        packages.push({
            name: name,
            version: version
        })
    }
    return packages;
}