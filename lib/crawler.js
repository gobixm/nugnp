const packageJson = require('package-json');

async function getPackagesInfo(packages) {
    let infoes = [];
    for (const package of packages) {
        const meta = await getMeta(package);
        if (meta) {
            infoes.push(meta);
        }
    }
    return infoes;
}

async function getMeta(package) {
    try {
        console.log(`GET ${package.name}`)
        const meta = await packageJson(package.name, { fullMetadata: true })

        return {
            ...package,
            latest: meta.version,
            description: meta.description,
            repository: meta.repository ? meta.repository.url : '',
            license: meta.license,
            id: meta._id,
            homepage: meta.homepage
        }
    } catch (err) {
        console.warn(`failed to get info from npm registry for package "${package.name}"`)
    }
}

module.exports.getPackagesInfo = getPackagesInfo;