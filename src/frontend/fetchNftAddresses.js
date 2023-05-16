import { ethers } from 'ethers'

export default async function fetchNftAddresses(owner, registrarImpl) {
  /*
    const [registers, transfersFrom, transferTo] = await Promise.all([
        registrarImpl.queryFilter(registrarImpl.filters.Registered(null, owner)),
        registrarImpl.queryFilter(registrarImpl.filters.Transfer(owner)),
        registrarImpl.queryFilter(registrarImpl.filters.Transfer(null, owner))
    ])

    let nftAddresses = registers.map(convertToAddress)
    const transferEvents = transfersFrom
        .concat(transferTo)
        .sort((e1, e2) => {
            if (e1.blockNumber < e2.blockNumber)
                return -1
            else if (e1.blockNumber > e2.blockNumber)
                return 1
            else {
                if (e1.transactionIndex < e2.transactionIndex)
                    return -1
                else
                    return 1
            }
        })
        .reduce((nftAddresses, event) => {
            if (event.args.from === owner) {

            }
            if (event.args.to === owner) {
                nftAddresses.push(convertToAddress())
            }
        }, nftAddresses)

    const a = transferEvents.*/

  return (await registrarImpl.queryFilter(registrarImpl.filters.Transfer(null, owner))).map(
    convertToAddress
  )
}

function convertToAddress(event) {
  return {
    address: ethers.utils.hexlify(event.args.tokenId),
    owner: event.args.to,
  }
}
