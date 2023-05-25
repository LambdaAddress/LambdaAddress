import { ethers } from 'ethers'
import { createClient, cacheExchange, fetchExchange } from 'urql'

export default async function fetchNftAddresses(owner, registrarImpl, network) {
  return network?.graphUrl !== undefined
    ? fetchNftAddressesFromGraph(owner, network)
    : fallBack(owner, registrarImpl)
}

async function fetchNftAddressesFromGraph(owner, network) {
  const query = `
    query {
      lambdaAddresses(first: 50, where: { owner: "${owner}" }) {
        id
        address
        owner
        tokenURI
      }
    }`

  const client = createClient({ url: network.graphUrl, exchanges: [cacheExchange, fetchExchange], })
  const result = await client.query(query).toPromise()
  return result?.data?.lambdaAddresses.map(convertGraphData) || []
}

async function fallBack(owner, registrarImpl) {
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

function convertGraphData(data) {
  return {
    ...data,
    address: `0x${BigInt(data.id).toString(16)}`
  }
}
