export interface User {
    _id: string | null; // MongoDB ObjectId
    username: string | null; // Unique username
    password?: string | null; // Optional hashed password
    email?: string | null; // Optional, unique email
    usertype: 'normal' | 'admin'; // Enum: normal or admin
    wallet: string[] ; // Array of wallet addresses
    nonce?: string; // Optional nonce
    bio?: string | null; // Optional bio
    links?: string | null; // Optional link to personal site or portfolio
    rep: number | null; // Reputation score (default 0)
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
     __v?: number;
  }

  