//const relayerUrl = 'https://relayer.ambire.com'
const relayerUrl = 'http://127.0.0.1:5000'

export default {
    // Ethereum 
    "1": {
        AmbireAccountImplementation: "0x2A2b85EB1054d6f0c6c2E37dA05eD3E5feA684EF",
        relayerUrl
    },
    // Optimism
    "10": {
        AmbireAccountImplementation: "0x2A2b85EB1054d6f0c6c2E37dA05eD3E5feA684EF",
        relayerUrl
    },
    // Hardhat localhost
    "31337": {
        AmbireAccountImplementation: "0x2A2b85EB1054d6f0c6c2E37dA05eD3E5feA684EF",
        relayerUrl: relayerUrl
    },
    // Goerli
    "5": {
        AmbireAccountImplementation: "0x2A2b85EB1054d6f0c6c2E37dA05eD3E5feA684EF",
        relayerUrl
    },
    // Sepolia
    "11155111": {
        AmbireAccountImplementation: "0x2A2b85EB1054d6f0c6c2E37dA05eD3E5feA684EF",
        relayerUrl
    }
}