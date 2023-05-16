import generateNFTAddress from "./generateNFTAddress.mjs"

const workerInit = {
    wait: function() {
        return new Promise(res => {
            this.resolve = res
        })
    }
}

export default async function workerLogic(self, Module) {

    Module.onRuntimeInitialized = () => { workerInit.resolve() }

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener("message", async e => {
        if (!e) return

        const { id, factory, owner, difficulty = 0, matchStart } = e.data

        const worker = Module.cwrap('worker', 'string', ['string', 'string', 'number', 'bool', 'number'])

        let lastIteration = 0n
        const fnPtr = Module.addFunction((it) => {
            console.debug(`Worker ${id}: ${it} iterations: `)
            
            postMessage({
                event: 'UPDATE',
                iteration: it
            })

            lastIteration = it
        }, 'vj')

        console.debug(`Worker ${id} starting`)

        const salt = '0x' + worker(factory, owner, difficulty, matchStart, fnPtr)

        console.debug('success: ', salt)

        postMessage({
            event: 'SUCCESS',
            address: generateNFTAddress(factory, owner, salt),
            salt,
            iteration: lastIteration
        })
        //const startTime = performance.now()
        
    })

    await workerInit.wait()

    postMessage({
        event: 'READY',
        iteration: 0n
    })

}
