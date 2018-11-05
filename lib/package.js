const fsPromises = require('fs').promises;

async function readPackages(path) {
    const content = await fsPromises.readFile(path, 'utf8');
    const json = JSON.parse(content);
    if (!json.dependencies) {
        return [];
    }
    const dependencies = json.dependencies;

    let packages = [];

    for (const name in dependencies) {
        const version = dependencies[name].replace(/^(\^|~)/, '');
        packages.push({
            name: name,
            version: version
        })
    }
    return packages;
}

exports.readPackages = readPackages;