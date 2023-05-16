import { promises as fs } from 'fs'
import path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default async function exportAbi(abis) {
    const filePath = path.join(__dirname, '..', 'abi')

    for (const key in abis) {
        await fs.writeFile(path.join(filePath, `${key}.json`), JSON.stringify({ abi: abis[key]}, null, 2))
    }
     
}