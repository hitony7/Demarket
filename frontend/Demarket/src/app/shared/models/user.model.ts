export interface User {
    _id: string; // MongoDB ObjectId
    username: string; // Unique username
    password?: string; // Optional hashed password
    email?: string; // Optional, unique email
    usertype: 'normal' | 'admin'; // Enum: normal or admin
    wallet: string[]; // Array of wallet addresses
    nonce?: string; // Optional nonce
    bio?: string; // Optional bio
    links?: string; // Optional link to personal site or portfolio
    rep: number; // Reputation score (default 0)
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
  }