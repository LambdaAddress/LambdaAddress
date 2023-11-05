import { promises as fs } from 'fs'
import path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const SUPPORTED_NETWORKS = [{
    name: 'Mainnet',
    file: 'mainnet.json'
},{
    name: 'Arbitrum',
    file: 'arbitrum.json'
}, {
    name: 'Optimism',
    file: 'optimism.json',
}, {
    name: 'Goerli',
    file: 'goerli.json'
}]


export default async function generateSupportedNetworksDoc() {
    const filePath = path.join(__dirname, '..', 'config')

    const networks = await Promise.all(
        SUPPORTED_NETWORKS.map(async ({ name, file }) => ({ 
            name, 
            contracts: JSON.parse(await fs.readFile(path.join(filePath, file), 'utf8'))
        }))
    )

    await fs.writeFile(path.join(filePath, `README.md`), docTemplate(networks))
}


function docTemplate(networks) {
    return `# Supported networks

${networks.map(({ name, contracts }) => networkTemplate(name, contracts)).join('\n')}
`
}

function networkTemplate(networkName, contracts) {
    return `## ${networkName}

${Object.entries(contracts)
    .filter(([name]) => name !== 'mintPrice')
    .map(([name, contract]) => `  - **${name}**: \`${contract}\``)
    .join('\n')}
`
}