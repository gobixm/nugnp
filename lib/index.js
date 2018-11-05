const package = require('./package');
const crawler = require('./crawler');
const reporter = require('./reporter');

const config = require('rc')('tp-report', {
    path: '.',
    out: './third-party.csv'
});

async function run() {
    const packages = await package.readPackages(`${config.path}/package.json`);
    const infoes = await crawler.getPackagesInfo(packages);
    await reporter.reportCsv(infoes, config.out);
}

module.exports.run = run;
