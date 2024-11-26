
import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;

if (!projectId || !projectSecret) {
 //throw new Error('Missing Infura Project ID or Secret. Set them in the .env file.');
}

const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default ipfsClient;