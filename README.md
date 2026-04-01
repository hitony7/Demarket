# Demarket

Demarket is a decentralized marketplace prototype with three main parts:

- an Angular frontend in `frontend/Demarket`
- an Express + MongoDB backend in `backend`
- a Solidity escrow contract in `smart-contracts`

The project is built around wallet-based authentication, listing management, profile pages, image uploads to IPFS through Pinata, and an escrow contract for transaction handling.

## Repository Layout

```text
Demarket/
|- backend/            Express API, auth, uploads, MongoDB models
|- frontend/Demarket/  Angular application and SSR build setup
|- smart-contracts/    Solidity contract, Truffle config, tests
|- README.md
```

## Current Stack

- Frontend: Angular 21, Angular SSR, Tailwind CSS 4, Font Awesome 7, ethers.js, web3
- Backend: Node.js, Express 5, MongoDB with Mongoose 9, JWT auth, Multer 2
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

The current contract is [`smart-contracts/contracts/DecentralizedEscrow.sol`](./smart-contracts/contracts/DecentralizedEscrow.sol).

It supports:

- buyer-funded escrow on deployment
- buyer confirmation of receipt
- disputes opened by buyer or seller
- arbiter-controlled dispute resolution

See [smart-contracts/README.md](./smart-contracts/README.md) for contract-specific notes.

## Prerequisites

- Node.js 20+ recommended
- npm 11+
- MongoDB
- Truffle and Ganache for local contract work
- A Pinata account for file uploads

## Environment Variables

### Backend

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/demarket
JWT_SECRET=replace_with_a_real_secret
PRIVATE_KEY_DEV=replace_with_a_test_wallet_private_key
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
```

Notes:

- `PRIVATE_KEY_DEV` is only for the testing signature endpoint.
- the backend currently throws on startup if Pinata credentials are missing
- never commit backend secrets

### Frontend

The frontend now includes tracked environment files under `frontend/Demarket/src/environment/`:

- `enviroment.ts`
- `enviroment.prod.ts`

They currently define safe defaults such as:

- `production`
- `apiBaseUrl`

These files are intended to be committed because they are required for the app to compile and do not contain secrets.

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
npm run dev
```

The backend dev script now uses:

```bash
node --watch src/app.js
```

The API will be available at `http://localhost:3000/api`.

### 3. Start the frontend

```bash
cd frontend/Demarket
npm start
```

The frontend will be available at `http://localhost:4200`.

### 4. Build the frontend

```bash
cd frontend/Demarket
npm run build
```

The current production build completes successfully and outputs to `frontend/Demarket/dist/demarket`.

Build notes:

- `npm run build` is currently working
- the build still reports a Sass `@import` deprecation warning
- the initial bundle currently exceeds the configured Angular size budget

### 5. Work with smart contracts

Start Ganache, then run:

```bash
cd smart-contracts
truffle compile
truffle test
```

Use `truffle migrate` to deploy to your configured network.

## Build And Test Status

### Frontend

Available commands:

- `cd frontend/Demarket && npm run build`
- `cd frontend/Demarket && npm test`

Current status:

- `npm run build` succeeds
- `npm test` is available but was not revalidated in this update

### Backend

Available commands:

- `cd backend && npm run dev`
- `cd backend && npm test`

Current status:

- `npm run dev` points to the correct entrypoint and uses Node watch mode
- no real backend test suite is configured yet

### Smart Contracts

Available commands:

- `cd smart-contracts && truffle compile`
- `cd smart-contracts && truffle test`

Current status:

- contract compile/test commands are documented
- they were not re-run in this update

## Known Notes

- The frontend uses tracked files in `src/environment`, but the folder/file name is currently spelled `enviroment` to match the existing imports.
- `npm run build` currently succeeds, but the frontend still reports a Sass `@import` deprecation warning and a bundle-size budget warning.
- The backend starts without MongoDB, but it will log a connection failure until a MongoDB instance is available.

## Next Improvements

- rename `enviroment` to `environment` everywhere
- replace the Sass `@import "tailwindcss"` usage with the newer non-deprecated pattern
- reduce frontend bundle size or raise the current Angular budget thresholds
- add backend tests
- document deployment targets and wallet/network setup
