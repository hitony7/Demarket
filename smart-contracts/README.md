# Demarket Smart Contracts

This directory contains the Solidity contract and Truffle configuration for Demarket's escrow flow.

## What Is Here

- `contracts/DecentralizedEscrow.sol` - the main escrow contract
- `test/DecentralizedEscrow.test.js` - contract tests
- `truffle-config.js` - Truffle network configuration
- `build/contracts/` - compiled artifact output

## Current Contract

`DecentralizedEscrow.sol` is a simple escrow contract with three roles:

- buyer
- seller
- arbiter

Current behavior:

- the buyer deploys the contract and funds it with ETH
- the buyer can confirm receipt to release funds to the seller
- the buyer or seller can open a dispute
- the arbiter can resolve the dispute in favor of the seller or buyer

## Prerequisites

- Node.js
- npm
- Truffle
- Ganache or another Ethereum-compatible network

Install Truffle globally if needed:

```bash
npm install -g truffle
```

## Working In This Folder

From the repository root:

```bash
cd smart-contracts
```

## Compile

```bash
truffle compile
```

Compiled artifacts are written to `build/contracts/`.

## Test

```bash
truffle test
```

The current test suite lives in `test/DecentralizedEscrow.test.js`.

## Deploy

Start Ganache or configure a target network in `truffle-config.js`, then run:

```bash
truffle migrate
```

To redeploy from scratch:

```bash
truffle migrate --reset
```

## Notes

- This contract is a prototype and should not be treated as production-ready.
- No audit or formal security review is documented in this repository.
- The `build/contracts` directory contains generated files and may need to be refreshed after contract changes.

## Recommended Next Steps

- expand test coverage for dispute edge cases
- document expected constructor arguments and example deployment values
- add clear local network instructions for Ganache
- review the contract before any public-network deployment
