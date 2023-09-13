import { getProxyDeployBytecode } from './IdentityProxyDeploy'
import { utils } from 'ethers'
const { getAddress } = utils

export function getExportData(accountAddr, factory, baseAccount, signer) {
    return {
        id: accountAddr,
        salt: generateSalt(accountAddr),
        identityFactoryAddr: factory,
        baseIdentityAddr: baseAccount,
        bytecode: getProxyDeployBytecode(
            baseAccount, 
            [[signer, '0x0000000000000000000000000000000000000000000000000000000000000001']]
        ),
        signer: {
            address: signer
        },
        signerExtra: {
            type: "Web3"
        },
        downloadedBackup: true
    }
}

// Used to send to the Ambire relayer to create the wallet
export function getMetadata(accountAddr, factory, baseAccount, signer) {
    return {
        salt: generateSalt(accountAddr),
        identityFactoryAddr: factory,
        baseIdentityAddr: baseAccount,
        privileges: [
            [signer, '0x0000000000000000000000000000000000000000000000000000000000000001']
        ],
        signerType: "Web3"
    }
}


export async function sendWalletCreationRequest(walletAddress, relayerUrl, metadata) {
    try {
        console.log('Sending wallet metadata')
        const formattedAddress = getAddress(walletAddress)
        const fullUrl = `${relayerUrl}/identity/${formattedAddress}`        

        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata)
        })
    
        if (!response.ok) {
          console.log('response: ', response)
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
    
        const responseData = await response.json()
        console.log('response: ', responseData)
        
        return responseData
      } catch (error) {
        console.error('Error sending POST request:', error)
        throw error
    }
}

export function downloadJson(exportObj, filename) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function assumes `accountAddr` is valid and begins with `0x`
function generateSalt(accountAddr) {
    return `0x000000000000000000000000${accountAddr.slice(2)}`
}