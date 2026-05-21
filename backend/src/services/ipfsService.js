import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import { Readable } from 'stream';

dotenv.config(); // Load environment variables

const apiKey = process.env.PINATA_API_KEY;
const apiSecret = process.env.PINATA_API_SECRET;
const customGateway = 'https://tan-imperial-whale-861.mypinata.cloud/ipfs'; // Custom Pinata gateway

const uploadToPinata = async (file) => {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Missing Pinata API Key or Secret. Set them in the .env file.');
    }

    if (!file || !file.buffer) {
      throw new Error('Invalid file or file buffer.');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('pinataMetadata', JSON.stringify({ name: file.originalname }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: 'Infinity',
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      },
    });

    if (!response || !response.data) {
      throw new Error('No response or data received from Pinata.');
    }

    const { IpfsHash } = response.data;
    return {
      ipfsHash: IpfsHash,
      fileUrl: `${customGateway}/${IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading file to Pinata:', error.message);
    if (error.response) {
      console.error('Pinata API Response:', error.response.data);
    }
    throw error;
  }
};

export default uploadToPinata;


// Example usage:
// import fs from 'fs';
// const file = fs.createReadStream('./example-file.jpg');
// uploadToPinata(file, { name: 'Example File', keyvalues: { exampleKey: 'exampleValue' } });
