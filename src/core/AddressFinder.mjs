import Worker from 'web-worker'

const WORKER_PATH = './addressGeneratorWorker.js'


export default class AddressFinder {
  #workersIterations = []
  #workers = []
  #generatedAddress
  #salt
  #factory
  #owner
  #difficulty
  #onSuccess = () => {}
  #onError = () => {}
  #workerPath
  #matchStart

  constructor({ factory, owner, difficulty, onSuccess, onError, workerPath, matchStart }) {
    this.#factory = factory
    this.#owner = owner
    this.#difficulty = difficulty
    this.#onSuccess = onSuccess
    this.#onError = onError || this.#onError
    this.#workerPath = workerPath || WORKER_PATH
    this.#matchStart = matchStart || false
  }

  getGeneratedAddress() {
    return this.#generatedAddress
  }

  getIterations() {
    return this.#workersIterations.reduce((total, curr) => total + (curr || 0n), 0n)
  }

  getSalt() {
    return this.#salt
  }

  start() {
    const cores = typeof navigator !== "undefined"
      ? navigator.hardwareConcurrency
      : 1

    this.#workers = [...Array(cores).keys()].map((core) => this.#runWorker(core))
  }

  stop() {
    this.#terminateWorkers()
  }

  #runWorker(id) {
    const worker = new Worker(this.#workerPath)

    worker.onerror = (err) => this.#onError(err)
    worker.onmessage = (e) => {
      const { event, address, iteration, salt } = e.data
      this.#workersIterations[id] = iteration || 0n

      if (event === 'SUCCESS') {
        this.#generatedAddress = address
        this.#salt = salt
        console.debug('Address found: ', address, salt)
        this.#terminateWorkers()
        this.#onSuccess()
      }

      if (event === 'READY') {
        worker.postMessage({
          id,
          factory: this.#factory,
          owner: this.#owner,
          difficulty: this.#difficulty,
          matchStart: this.#matchStart
        })
      }
    }

    return worker
  }

  #terminateWorkers() {
    for (let worker of this.#workers) worker.terminate()
  }
}

