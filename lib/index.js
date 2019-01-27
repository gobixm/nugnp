const package = require('./package');
const crawler = require('./crawler');
const csvReporter = require('./csv-reporter');
const confluenceReporter = require('./confluence-reporter');

const config = require('rc')('tp-report', {
    path: '.',
    out: './third-party.csv',
    target: 'csv'
});

async function run() {
    const packages = await package.readPackages(`${config.path}/package.json`);
    const infoes = await crawler.getPackagesInfo(packages);

    let reporter = null;
    switch (config.target) {
        case 'csv':
            reporter = csvReporter;
            break;

        case 'confluence':
            reporter = confluenceReporter;
            break;
    }
    await reporter.report(infoes, config);
}

module.exports.run = run;
