// eslint-disable-next-line no-restricted-globals
self.importScripts('workerLogic_bundle.js')
self.importScripts('worker.js')

// eslint-disable-next-line no-undef
const { default: workerLogic } = $workerLogic

workerLogic(self, Module)
