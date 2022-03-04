import rc from 'rc';

import { readPackages } from './package-info.js';
import { getPackagesInfo, NodePackageInfo } from './crawler.js';
import { report } from './csv-reporter.js';
import { reportConfluence } from './confluence-reporter.js';


const config = rc('tp-report', {
    path: '.',
    out: './third-party.csv',
    target: 'csv'
});

export async function run() {
    const packages = await readPackages(`${config.path}/package.json`);
    const infoes = await getPackagesInfo(packages);

    let reporter: (infoes: NodePackageInfo[], config) => Promise<void> = null;
    switch (config.target) {
        case 'csv':
            reporter = report;
            break;

        case 'confluence':
            reporter = reportConfluence;
            break;
    }
    await reporter(infoes, config);
}
