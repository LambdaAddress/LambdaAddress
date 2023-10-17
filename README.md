[![Build](https://github.com/LambdaAddress/LambdaAddress/actions/workflows/main.yml/badge.svg)](https://github.com/LambdaAddress/LambdaAddress/actions/workflows/main.yml) [![Coverage Status](https://coveralls.io/repos/github/LambdaAddress/LambdaAddress/badge.svg?branch=master)](https://coveralls.io/github/LambdaAddress/LambdaAddress?branch=master)


# <img src="src/frontend/images/logo.svg" height="34" style="vertical-align: bottom;" /> Lambda Address

> **Important**: The smart contracts are currently undergoing an auditing process. In the meantime, please consider the app to be in an experimental state.

# Pre-requisites

- [yarn](https://classic.yarnpkg.com/lang/en/docs/install) 
- [foundry](https://book.getfoundry.sh/getting-started/installation)

# Install

```
yarn install
```

# How to run

### 1. Run a local hardhat node

```
yarn blockchain
```

### 2. Compile and deploy smart contracts

```
yarn contracts:deploy
```

### 3. Run the frontend

```
yarn frontend:start
```

# Tests

## Running all tests

```
yarn test
```

## Running tests individually

### Smart contracts tests

```
yarn contracts:test
``` 

### Core tests

```
yarn core:test
``` 

### Integration tests

```
yarn integration:test
``` 

### Coverage 

```
yarn contracts:coverage
```

or 

```
yarn contracts:coverage:lcov
```

# Builds and deployment

## Building the frontend

Simply run the `yarn frontend:build` command. The output will be stored in the `build` folder. 

It's possible to run a local server to test the build with the following command: `yarn frontend:serve`.

## Contracts deployment

### 1. Set the 3 following enviroment variables:
  - `NODE_URL`: URL of the Ethereum node
  - `KEY`: Private key of the wallet used for the deployment

Example:

```bash
export NODE_URL="https://rinkeby.infura.io/v3/0123456789abcdef0123456789abcdef"
export KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### 2. Run one of the following yarn commands:
  - `yarn deploy:sepolia`
  - `yarn deploy:mainnet`


# Other yarn commands

- `yarn console` : Shortcut for `hardhat console`
- `yarn docgen` : Generate documentation
- `yarn contracts:prettier:check` : Prettier check on smart contracts
- `yarn contracts:prettier:write` : Prettier write on smart contracts
- `yarn frontend:prettier:check` : Prettier check on frontend code
- `yarn frontend:prettier:write` : Prettier write on frontend code
- `yarn frontend:serve` : Run a local server for the frontend build

# Supported networks

The following chains are currently supported: 

- Arbitrum
- Optimism
- Goerli
- Sepolia

A list of the corresponding contract addresses can be found [here](./src/config/README.md).

