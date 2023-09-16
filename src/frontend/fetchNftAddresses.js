import { ethers } from 'ethers'
import { createClient, cacheExchange, fetchExchange } from 'urql'

// This function may not  support all the fields when running locally (without subgraphs)
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
  return Promise.all(
    (await registrarImpl.queryFilter(registrarImpl.filters.Transfer(null, owner)))
      .map(event => convertTransferEventToAddress(event, registrarImpl))
  )
}

async function convertTransferEventToAddress(event, registrarImpl) {
  const address = ethers.utils.hexlify(event.args.tokenId)
  const isDeployed = await registrarImpl.getIsDeployed(address)
  return {
    address,
    owner: event.args.to,
    isDeployed
  }
}


