import development from './development'
import sepolia from './sepolia'

const supportedNetworks = {
    31337: {
        name: 'localhost',
        chainId: 31337,
        isTestnet: true,
        contracts: development
    },/*
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
        isTestnet: false
    },*/
    11155111: { 
        name: 'Sepolia',
        chainId: 11155111,
        rpcUrls: ['https://rpc.sepolia.org'],
        nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        isTestnet: true,
        contracts: sepolia
    }
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