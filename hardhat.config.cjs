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
    mainnet: {
      url: NODE_URL || 'https://eth.llamarpc.com',
      chainId: 1,
      accounts: [KEY]
    },
    arbitrum: {
      url: NODE_URL || 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      accounts: [KEY]
    },
    optimism: {
      url: NODE_URL || 'https://optimism.publicnode.com',
      chainId: 10,
      accounts: [KEY]
    },
    hardhat: {
    },
    sepolia: {
      url: NODE_URL || 'https://rpc2.sepolia.org',
      chainId: 11155111,
      accounts: [KEY]
    },
    holesky: {
      url: NODE_URL || 'https://1rpc.io/holesky',
      chainId: 17000,
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
    optimism_goerli: {
      url: NODE_URL || 'https://optimism-goerli.publicnode.com',
      chainId: 420,
      accounts: [KEY],
      gasPrice: 500000000
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