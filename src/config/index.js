import arbitrum from './arbitrum'
import development from './development'
import sepolia from './sepolia'
import mumbai from './mumbai'
import goerli from './goerli'
import optimismGoerli from './optimism_goerli'
import optimism from './optimism'

const supportedNetworks = {
    31337: {
        name: 'localhost',
        chainId: 31337,
        isTestnet: true,
        contracts: development
    },
    10: {
        chainId: 10,
        name: 'Optimism',
        chainName: 'Optimism',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://optimism.publicnode.com'],
        blockExplorerUrls: ['https://optimistic.etherscan.io/'],
        isTestnet: false,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-optimism/version/latest',
        graphId: 'QmeZEc4pPjckedbuBeoABft9npEzpEEmEJC1oNnX9nAjvd',
        contracts: optimism
    },
    42161: {
        chainId: 42161,
        name: 'Arbitrum',
        chainName: 'Arbitrum One Mainnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/'],
        isTestnet: false,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-arbitrum/version/latest',
        graphId: 'QmPpf9fxmj8275pUFntu9F8NJjFBPqYNvoe8AA9wmseDnN',
        contracts: arbitrum
    },
    11155111: { 
        name: 'Sepolia',
        chainId: 11155111,
        rpcUrls: ['https://rpc.sepolia.org'],
        nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        isTestnet: true,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-sepolia/version/latest',
        graphId: 'Qmbwi9p8aCebFk1QC4KJ3dthND7tHwNCGcLNdHMvxNj9TW',
        contracts: sepolia
    },/*
    80001: { 
        name: 'Polygon Mumbai',
        chainId: 80001,
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        isTestnet: true,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-mumbai/version/latest',
        contracts: mumbai
    },*/
    5: { 
        name: 'Goerli',
        chainId: 5,
        rpcUrls: ['https://gateway.tenderly.co/public/goerli'],
        nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
        blockExplorerUrls: ['https://goerli.etherscan.io'],
        isTestnet: true,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-goerli/version/latest',
        graphId: 'QmeKk6yQTVBHMi91wCwH9mcfnH1ApH7PxarvyApuoAkYrB',
        contracts: goerli
    },/*
    420: { 
        name: 'Optimism Goerli',
        chainId: 420,
        rpcUrls: ['https://optimism-goerli.publicnode.com'],
        nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
        blockExplorerUrls: ['https://goerli-optimism.etherscan.io'],
        isTestnet: true,
        graphUrl: 'https://api.studio.thegraph.com/query/47325/lambdaaddress-optimism-goerli/version/latest',
        contracts: optimismGoerli
    }*/
}

const UnsupportedNetwork = {
    name: 'Unsupported Network',
    chainId: 0,
    isTestnet: false,
    contracts: {}  
}

export function getNetworkInfo(chainId) {
    if (!isChainIdSupported(chainId))
        throw new Error(`Unsupported chainId: ${chainId}`)

    return supportedNetworks[chainId]
}

export function getSupportedNetworks() {
    return Object.values(supportedNetworks)
}

export function getUnsupportedNetwork() {
    return UnsupportedNetwork
}

export function isChainIdSupported(chainId) {
    return Boolean(supportedNetworks[chainId])
}