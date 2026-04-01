# Demarket

Demarket is a decentralized marketplace prototype with three main parts:

- An Angular frontend in `frontend/Demarket`
- An Express + MongoDB backend in `backend`
- A Solidity escrow contract in `smart-contracts`

The app is structured around wallet-based authentication, marketplace listings, user profiles, file uploads to IPFS through Pinata, and an escrow flow for marketplace transactions.

## Repository Layout

```text
Demarket/
|- backend/           Express API, MongoDB models, auth, uploads
|- frontend/Demarket/ Angular application and UI routes
|- smart-contracts/   Solidity contract, Truffle config, tests
|- README.md
```

## Current Stack

- Frontend: Angular 19, Tailwind CSS, ethers.js, web3
- Backend: Node.js, Express, MongoDB with Mongoose, JWT auth, Multer
- Storage: Pinata / IPFS uploads
- Blockchain: Solidity with Truffle

## Frontend Routes

The Angular app currently includes these main routes:

- `/` - landing page
- `/listings` - marketplace listing index
- `/listing/:id` - single listing detail page
- `/createlistings` - protected listing creation page
- `/profile/:id` - public user profile
- `/dashboard` - protected user dashboard
- `/settings` - settings page

## Backend API

The API is mounted at `/api`.

### Auth

- `POST /api/auth/request-nonce`
- `POST /api/auth/verify-signature`
- `POST /api/auth/generate-signature`

### Listings

- `POST /api/listing/`
- `GET /api/listing/all`
- `GET /api/listing/`
- `GET /api/listing/:id`
- `PUT /api/listing/:id`
- `DELETE /api/listing/:id`

### Users

- `GET /api/users/:id`
- `GET /api/users/by-wallet/:walletAddress`
- `GET /api/users/:id/public`
- `PUT /api/users/:id`
- `GET /api/users/:id/listings`

### Files

- `POST /api/file/upload`
- `POST /api/file/upload-images`
- `GET /api/file/listings/:id`

## Smart Contract

The current on-chain contract is [`smart-contracts/contracts/DecentralizedEscrow.sol`](./smart-contracts/contracts/DecentralizedEscrow.sol).

It supports:

- buyer-funded escrow at deployment
- buyer receipt confirmation
- dispute creation by buyer or seller
- dispute resolution by an arbiter

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB instance
- Truffle and Ganache for local smart contract work
- A Pinata account for IPFS uploads

## Environment Variables

Create `backend/.env` with the values your local environment needs:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/demarket
JWT_SECRET=replace_with_a_real_secret
PRIVATE_KEY_DEV=replace_with_a_test_wallet_private_key
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
```

Notes:

- `PRIVATE_KEY_DEV` is used by the testing signature endpoint and should never be a production key.
- The backend currently throws on startup if the Pinata credentials are missing.

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend/Demarket
npm install
```

### Smart Contracts

Install Truffle globally if needed:

```bash
npm install -g truffle
```

## Running Locally

### 1. Start MongoDB

Make sure your MongoDB server is running before starting the backend.

### 2. Start the backend

```bash
cd backend
node src/app.js
```

Important:

- `backend/package.json` currently defines `npm run dev` as `nodemon src/index.js`, but `src/index.js` does not exist in this repository.
- Until that script is corrected, `node src/app.js` is the reliable local startup command.

The API will be available at `http://localhost:3000/api`.

### 3. Start the frontend

```bash
cd frontend/Demarket
npm start
```

The frontend will be available at `http://localhost:4200`.

### 4. Work with smart contracts

Start Ganache, then run:

```bash
cd smart-contracts
truffle compile
truffle test
```

Use `truffle migrate` to deploy to your configured network.

## Testing

- Frontend: `cd frontend/Demarket && npm test`
- Backend: no automated backend test suite is configured yet
- Smart contracts: `cd smart-contracts && truffle test`

## Known Gaps

- The root README previously referenced Angular environment files, but this repo does not currently include a `src/environments` directory in the frontend.
- The backend dev script is out of sync with the actual source tree.
- The smart-contracts folder contains a separate README, but it is partially duplicated and may need cleanup.

## Next Improvements

- fix the backend `dev` script to use the real entrypoint
- add backend tests
- add frontend environment configuration
- document deployment targets and wallet/network setup
