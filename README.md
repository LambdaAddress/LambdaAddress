[![Build](https://github.com/MrElement01/LambdaAddress/actions/workflows/main.yml/badge.svg)](https://github.com/MrElement01/LambdaAddress/actions/workflows/main.yml)

# <img src="src/frontend/images/logo.svg" height="34" style="vertical-align: bottom;" /> Lambda Address


## Install

```
yarn install
```


## Run

### 1. Run a local hardhat node

```
yarn blockchain
```

### 2. Compile and deploy smart contracts

```
yarn deploy
```

### 3. Run frontend

```
yarn frontend:start
```


# Contracts


## Deployment

### 1. Set the 3 following enviroment variables:
  - `NODE_URL`: URL of the Ethereum node
  - `GAS_PRICE`: Gas price (in wei)
  - `KEY`: Private key of the wallet used for the deployment

Example:

```bash
export NODE_URL="https://rinkeby.infura.io/v3/0123456789abcdef0123456789abcdef"
export GAS_PRICE=40000000000
export KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### 2. Run one of the following npm scripts:
  - `deploy:rinkeby`
  - `deploy:mainnet`
