import { ethers } from 'ethers'
import { createClient, cacheExchange, fetchExchange } from 'urql'

// This function doesn't support all the fields when running locally (without subgraphs)
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
        mintTime
        tokenURI
        isDeployed
      }
    }`

  const client = createClient({ url: network.graphUrl, exchanges: [cacheExchange, fetchExchange], })
  const result = await client.query(query).toPromise()
  return result?.data?.lambdaAddresses || []
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
    isDeployed: false
  }
}


