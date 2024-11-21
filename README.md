# Demarket

Demarket is a full-stack web application built with Angular on the frontend and Node.js with Express on the backend. It's designed to be a decentralized marketplace platform.

## Project Structure

The project is divided into two main parts:

1. Frontend (Angular)
2. Backend (Node.js/Express)
3. Smart Contracts (Solidity)

### Frontend

The frontend is an Angular application located in the `frontend/Demarket` directory.

### Backend

The backend is a Node.js application with Express, located in the `backend` directory.

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB (Make sure it's installed and running)
- Truffle Suite (`npm install -g truffle`)
- Ganache (for local blockchain development)

## Setup and Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend/Demarket
   npm install
   ```
4. Install smart contract dependencies:
   ```
   cd smart-contracts
   npm install
   ```

## Configuration

1. Backend:

   - Create a `.env` file in the `backend` directory
   - Add the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/[your_database_name]
     JWT_SECRET=[YOUR_JWT_SECRET]
     PRIVATE_KEY_DEV= [PRIVATE_KEY FOR DEVELOPMENT TESTING]
     ```

2. Frontend:

   - The frontend configuration is managed through Angular's environment files.
   - Update the `environment.ts` and `environment.prod.ts` files in the `frontend/Demarket/src/environments` directory with your settings.

   ```
   export const environment = {
    production: false,                   // Set to true for production
    apiBaseUrl: 'http://localhost:3000', // Replace with your backend API URL
    };
   ```

```

3. Smart Contracts:
 - Configure `truffle-config.js` in the `smart-contracts` directory with your network settings.

## Running the Application

1. Backend:

```

cd backend
npm run dev

```

The server will start on `http://localhost:3000`

2. Frontend:

```

cd frontend/Demarket
ng serve

````

The Angular app will start on `http://localhost:4200`

3. Smart Contracts:
- Start Ganache for a local blockchain
- Compile contracts:
  ```
  cd smart-contracts
  truffle compile
  ```
- Deploy contracts:
  ```
  truffle migrate
  ```

## API Endpoints

- GET `/api`: Welcome message
- (Add more endpoints as they are developed)

## Smart Contracts

The `smart-contracts` directory contains Solidity contracts that power the decentralized aspects of the marketplace. Key contracts include:

- `Marketplace.sol`: Handles core marketplace functionality

For more details, see the [Smart Contracts README](./smart-contracts/README.md).

## Testing

- Backend: (Add instructions when tests are implemented)
- Frontend: Run `ng test` to execute the unit tests via Karma
- Smart Contracts: Run `truffle test` in the `smart-contracts` directory

## Deployment

(Add deployment instructions specific to your hosting environment and chosen blockchain network)

## Built With

- [Angular](https://angular.io/) - The web framework used for the frontend
- [Express](https://expressjs.com/) - The web framework used for the backend
- [MongoDB](https://www.mongodb.com/) - The database used
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [Truffle](https://www.trufflesuite.com/truffle) - Development framework for Ethereum
````
