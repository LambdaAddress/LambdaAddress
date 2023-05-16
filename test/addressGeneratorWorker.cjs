Promise.all([
    import('../src/core/workerLogic.mjs'),
    import('../public/worker.js')
]).then(([{ default: workerLogic }, { default: Module}]) => {
    workerLogic(self, Module)
    Module.onRuntimeInitialized()
})
