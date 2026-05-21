# Demarket

Demarket is a decentralized marketplace prototype with three main parts:

- an Angular frontend in `frontend/app`
- an Express + MongoDB backend in `backend`
- a Solidity escrow contract in `smart-contracts`

The project is built around wallet-based authentication, listing management, profile pages, image uploads to IPFS through Pinata, and an escrow contract for transaction handling.

## Repository Layout

```text
Demarket/
|- backend/            Express API, auth, uploads, MongoDB models
|- frontend/app/       Angular application and SSR build setup
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

- `POST /api/listings/`
- `GET /api/listings/all`
- `GET /api/listings/`
- `GET /api/listings/:id`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

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
- Pinata credentials are only required for image upload endpoints
- never commit backend secrets

### Frontend

The frontend includes tracked environment files under `frontend/app/src/environment/`:

- `environment.ts`
- `environment.prod.ts`

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
cd frontend/app
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
cd frontend/app
npm start
```

The frontend will be available at `http://localhost:4200`.

### 4. Build the frontend

```bash
cd frontend/app
npm run build
```

The current production build completes successfully and outputs to `frontend/app/dist/demarket`.

Build notes:

- `npm run build` is currently working without warnings

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

- `cd frontend/app && npm run build`
- `cd frontend/app && npm test -- --watch=false --karma-config=karma.conf.ci.js`

Current status:

- `npm run build` succeeds
- `npm test -- --watch=false --karma-config=karma.conf.ci.js` succeeds

### Backend

Available commands:

- `cd backend && npm run dev`
- `cd backend && npm test`

Current status:

- `npm run dev` points to the correct entrypoint and uses Node watch mode
- `npm test` runs a Node test for the API health route and a backend syntax check

### Smart Contracts

Available commands:

- `cd smart-contracts && truffle compile`
- `cd smart-contracts && truffle test`

Current status:

- `truffle test` succeeds

## Known Notes

- The backend starts without MongoDB, but database-backed routes require `MONGODB_URI`.

## Next Improvements

- document deployment targets and wallet/network setup
