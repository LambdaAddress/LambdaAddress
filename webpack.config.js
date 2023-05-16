const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src/core/workerLogic.mjs"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "workerLogic_bundle.js",
    library: "$workerLogic",    
    libraryTarget: "umd",
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "development",
}