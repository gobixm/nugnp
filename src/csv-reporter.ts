import { promises as fsPromises } from 'fs';
import { Parser } from 'json2csv';
import { NodePackageInfo } from './crawler';

const parser = new Parser({
    delimiter: ';'
});

export async function report(infoes: NodePackageInfo[], config) {
    const csv = parser.parse(infoes);
    await fsPromises.writeFile(config.out, csv);
}