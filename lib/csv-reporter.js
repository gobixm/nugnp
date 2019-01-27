const fsPromises = require('fs').promises;
const Json2csvParser = require('json2csv').Parser;

async function report(infoes, config) {
    const parser = new Json2csvParser({ delimiter: ';' });
    const csv = parser.parse(infoes);
    await fsPromises.writeFile(config.out, csv);
}

module.exports.report = report;