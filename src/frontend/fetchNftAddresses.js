import { ethers } from 'ethers'
import { from, Observable, Subject, takeUntil } from 'rxjs'
import { createClient, cacheExchange, fetchExchange } from 'urql'

const apiUrl = 'https://api.thegraph.com/index-node/graphql'

// This function may not  support all the fields when running locally (without subgraphs)
export default function fetchNftAddresses(owner, registrarImpl, network) {
  return network?.graphUrl !== undefined
    ? fetchNftAddressesFromGraph(owner, network)
    : from(fallBack(owner, registrarImpl))
}



async function getSubgraphSyncStatus(subgraphId) {
  try {
    const query = `
    query {
      indexingStatuses(subgraphs: ["${subgraphId}"]) {
        synced
        health
        chains {
          chainHeadBlock {
            number
          }
          earliestBlock {
            number
          }
          latestBlock {
            number
          }
        }
        subgraph
      }
    }`

    const client = createClient({ url: apiUrl, exchanges: [cacheExchange, fetchExchange], })
    const { synced, chains } = (await client.query(query).toPromise())?.data?.indexingStatuses[0]
    const result = {
      synced,
      chainHeadBlock: BigInt(chains[0].chainHeadBlock.number),
      latestBlock: BigInt(chains[0].latestBlock.number)
    }
    console.log('Subgraph sync status: ', result)
    return result

  } catch(err) {
    console.error('Error fetching Subgraph sync status: ', err)
    return null
  }
}

async function fetchNftAddressesFromGraph(owner, network) {
  const source$ = new Subject()
  const syncStatus = await getSubgraphSyncStatus(network.graphId)

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
  setImmediate(() => source$.next(result?.data?.lambdaAddresses || []))  

  if (syncStatus && syncStatus.latestBlock < syncStatus.chainHeadBlock) {
    const chainHeadBlock = syncStatus.chainHeadBlock 
    let latestBlock = syncStatus.latestBlock

    const timer = setInterval(async () => {
      const newSyncStatus = await getSubgraphSyncStatus(network.graphId)

      if (newSyncStatus.latestBlock > latestBlock) {
        const result = await client.query(query).toPromise()
        source$.next(result?.data?.lambdaAddresses || [])
        latestBlock = newSyncStatus.latestBlock

        if (latestBlock > chainHeadBlock) {
          clearInterval(timer)
          source$.complete()
        }
      }
      
    }, 60000)
  }
  else {
    source$.complete()
  }

  return source$.asObservable()
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


