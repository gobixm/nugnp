import fetch from 'node-fetch';
import { Agent } from 'https';
import htmlencode from 'js-htmlencode';
import { NodePackageInfo } from './crawler';

const { htmlEncode } = htmlencode;
const httpsAgent = new Agent({ rejectUnauthorized: false });

export async function reportConfluence(infoes: NodePackageInfo[], config) {
    const columnMapping = {
        name: 'Name',
        version: 'Version',
        latest: 'Latest',
        description: 'Description',
        repository: 'Repository',
        license: 'License',
        homepage: 'Link'
    };

    await execute();

    async function execute() {
        const pageContent = `<table>${buildHeader()}${buildBody()}</table>`

        const page = await getPage();

        await updatePage(page, pageContent);
    }

    function buildHeader(): string {
        const columns = [];
        for (const prop in columnMapping) {
            columns.push(`<th>${columnMapping[prop]}</th>`);
        }

        return `<tr>${columns.join('')}</tr>`;
    }

    function buildBody(): string {
        return infoes
            .map(buildRow)
            .join('');
    }

    function buildRow(nodePackage: NodePackageInfo): string {
        const columns = [];

        columns.push(buildTextCell(nodePackage.name));
        columns.push(buildTextCell(nodePackage.version));
        columns.push(buildTextCell(nodePackage.latest));
        columns.push(buildTextCell(nodePackage.description));
        columns.push(buildLinkCell('link', nodePackage.repository));
        columns.push(buildTextCell(nodePackage.license));
        columns.push(buildLinkCell('link', nodePackage.homepage));

        return `<tr>${columns.join('')}</tr>`
    }

    function buildTextCell(text: string): string {
        return `<td>${htmlEncode(text || '')}</td>`;
    }

    function buildLinkCell(text: string, url: string): string {
        return `<td><a href="${url || ''}">${htmlEncode(text || '')}</a></td>`
    }

    async function getPage(): Promise<unknown> {
        const url = `${config.server}/rest/api/content/${config.page}`;
        console.log('Quering page state...');
        const response = await fetch(url, {
            method: 'GET',
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${config.credentials}`
            }
        });

        const body = await response.json();
        console.log('Page state received');

        return body;
    }

    async function updatePage(page, pageContent) {
        const url = `${config.server}/rest/api/content/${config.page}`;

        const body = {
            id: config.page,
            type: 'page',
            space: { key: config.space },
            title: page.title,
            body: {
                storage: {
                    value: pageContent,
                    representation: 'storage'
                }
            },
            version: { number: page.version.number + 1 },
        };

        console.log('Updating page...');
        const response = await fetch(url, {
            method: 'PUT',
            agent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${config.credentials}`
            },
            body: JSON.stringify(body)
        });
        console.log(`Update finished with staus code ${response.status}`);
    }
}