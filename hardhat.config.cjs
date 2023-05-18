require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")
require("dotenv").config()
require('solidity-docgen')
const fs = require("fs")
const path = require("path")

const DEFAULT_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000'

const { KEY=DEFAULT_KEY, NODE_URL, REPORT_GAS } = process.env

if (KEY === DEFAULT_KEY)
  console.warn('No private key found.')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    sources: 'src/contracts'
  },
  solidity: {
    version: "0.8.18",
    settings: {
      metadata: {
        appendCBOR: false
      },
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  gasReporter: {
    enabled: REPORT_GAS ? true : false,
    gasPrice: 25,
    outputFile: `test/gas-reports/${timestamp()}-${latestBuild()}.txt`,
    noColors: true
  },
  networks: {
    sepolia: {
      url: NODE_URL || 'https://rpc2.sepolia.org',
      chainId: 11155111,
      accounts: [KEY]
    },
    arbitrum_goerli: {
      url: NODE_URL || 'https://endpoints.omniatech.io/v1/arbitrum/goerli/public',
      chainId: 421613,
      accounts: [KEY]
    },
    goerli: {
      url: NODE_URL || 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 5,
      accounts: [KEY]
    },
    mumbai: {
      url: NODE_URL || 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      accounts: [KEY]
    },
  },
  docgen: {    
    outputDir: 'docs',
    templates: 'docs/templates',
    exclude: ['test'],
    pages: "files"
  },
}

function timestamp() {
  return new Date().getTime()
}

function latestBuild() {
  const files = orderReccentFiles('artifacts/build-info')
  return files.length ? files[0].file.toString().replace('.json', '') : undefined
}

function orderReccentFiles(dir) {
  try {
    return fs.readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
  } catch(e) {
    return []
  }
}