import {promises as fs } from 'fs'
import path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default function createConfig({ network, filePath, config}) {
    if (!filePath) 
        filePath = path.join(__dirname, '..', 'config')

    if (network === 'hardhat' || network === 'localhost')
        network = 'development'

    return fs.writeFile(path.join(filePath, `${network}.json`), JSON.stringify(config, null, 2))
}