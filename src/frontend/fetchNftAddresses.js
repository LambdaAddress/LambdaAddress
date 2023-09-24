import { ethers } from 'ethers'
import { from, Observable, Subject, takeUntil } from 'rxjs'
import { createClient, cacheExchange, fetchExchange } from 'urql'

// This function may not  support all the fields when running locally (without subgraphs)
export default function fetchNftAddresses(owner, registrarImpl, network) {
  return network?.graphUrl !== undefined
    ? fetchNftAddressesFromGraph(owner, network)
    : from(fallBack(owner, registrarImpl))
}


function getSubgraphSyncStatus(subgraphId) {
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

  const client = createClient({ url: '...', exchanges: [cacheExchange, fetchExchange], })
  return client.query(query)
}

function fetchNftAddressesFromGraph(owner, network) {
  const source$ = new Subject()

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
  client.query(query).toPromise().then(result => source$.next(result?.data?.lambdaAddresses || []))

  setTimeout(() => { 
    source$.complete() 
  }, 5000)
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


