import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';

@Component({
  selector: 'app-login-box',
  standalone: true,
  templateUrl: './loginbox.component.html',
  styleUrls: ['./loginbox.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class LoginBoxComponent {
  @Input() isModalOpen = false;
  @Output() walletConnected = new EventEmitter<string>(); // Emit wallet address
  email = '';
  provider: BrowserProvider | null = null;

  // Toggles the modal's visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  // Handles wallet connection
  async connectWallet(walletName: string) {
    if (walletName === 'MetaMask') {
      await this.connectMetaMask();
    } else {
      console.log(`${walletName} connection not implemented.`);
    }
    this.toggleModal(); // Close the modal after connection attempt
  }

  // Connect to MetaMask using MetaMask's built-in account selection window
  async connectMetaMask() {
    if ((window as any).ethereum) {
      try {
        // Create a new provider
        this.provider = new ethers.BrowserProvider((window as any).ethereum);

        // Request for account selection in MetaMask
        await (window as any).ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });

        // Explicitly await the eth_requestAccounts call
        const accounts = await this.provider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          const selectedAddress = accounts[0]; // Use the first selected account
          console.log(`Connected with MetaMask account: ${selectedAddress}`);

          // Set the selected account as the signer
          const signer: JsonRpcSigner = await this.provider.getSigner();
          const address = await signer.getAddress();

          // Emit the connected wallet address
          this.walletConnected.emit(address);

          // Prompt for signature request
          await this.requestSignature(signer, address);
        } else {
          alert('No MetaMask accounts selected.');
        }
      } catch (error) {
        console.error('MetaMask connection failed:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  }

  // Request a signature from the selected account
  async requestSignature(signer: JsonRpcSigner, address: string) {
    // Define the message to be signed
    const message = `
      Signature request
      Only confirm this message if you approve the content and trust the requesting site.

      Request from: opensea.io
      Message: 
      Welcome to DeMarket!
      Click to sign in and accept the DeMarket Terms of Service and Privacy Policy.

      This request will not trigger a blockchain transaction or cost any gas fees.

      Wallet address: ${address}
      Nonce: ${this.generateNonce()}
    `;

    try {
      // Request signature from the user
      const signature = await signer.signMessage(message);
      console.log(`Signature: ${signature}`);
      alert('Signature confirmed. You are now connected!');
    } catch (error) {
      console.error('Signature request failed:', error);
      alert('Signature request was denied.');
    }
  }

  // Generate a random nonce for the signature
  generateNonce() {
    return crypto.randomUUID(); // Generate a random UUID as the nonce
  }

  // Handles email login
  loginWithEmail() {
    console.log(`Logging in with email: ${this.email}`);
    this.toggleModal(); // Close the modal after input
  }
}
