// loginbox.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ethers } from 'ethers';
import { WalletService } from '../../services/wallet.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-box',
    templateUrl: './loginbox.component.html',
    styleUrls: ['./loginbox.component.scss'],
    imports: [FormsModule, CommonModule]
})
export class LoginBoxComponent {
  @Input() isModalOpen = false;
  @Output() walletConnected = new EventEmitter<string>(); // Emit wallet address
  email = '';
  provider: ethers.BrowserProvider | null = null;

  constructor(private walletService: WalletService, private authService: AuthService) {}

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
  }

 // Connect to MetaMask and authenticate with backend
 async connectMetaMask() {
  if ((window as any).ethereum) {
    try {
      // Create a new provider for MetaMask
      this.provider = new ethers.BrowserProvider((window as any).ethereum);

      // Request account access, triggering MetaMask to prompt account selection if multiple are available
      await this.provider.send('eth_requestAccounts', []);

      // Get the signer for the selected account
      const signer = await this.provider.getSigner();
      const address = await signer.getAddress();
      console.log(`Connected with MetaMask account: ${address}`);

      // Emit wallet address and store it in WalletService
      this.walletConnected.emit(address);
      this.walletService.setWalletAddress(address);

      // Proceed with authentication
      await this.authenticateWithBackend(signer, address);

      this.isModalOpen = false; // Close the modal after successful connection
    } catch (error: any) {
      console.error('MetaMask connection failed:', error);
      alert('MetaMask connection failed.');
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask and try again.');
  }
}
  // Authentication flow with backend
  async authenticateWithBackend(signer: ethers.Signer, address: string) {
    try {
      // Step 1: Request nonce from the server
      const nonceResponse: any = await this.authService.requestNonce(address);
      const nonce = nonceResponse.nonce;

      // Step 2: Sign the nonce using the wallet
      const message = `I am signing my one-time nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // Step 3: Send the signature to the server for verification and obtain JWT
      const tokenResponse: any = await this.authService.verifySignature(address, signature);
      const token = tokenResponse.token;

      // Store the token via AuthService
      this.authService.setToken(token);

      alert('Authentication successful!');
    } catch (error: any) {
      this.walletService.clearWalletAddress();
      console.error('Authentication failed:', error);
      alert('Authentication failed.');
    }
  }


  // Handles email login (if applicable)
  loginWithEmail() {
    console.log(`Logging in with email: ${this.email}`);
    this.isModalOpen = false; // Close the modal after input
  }
}
