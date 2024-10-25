import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ethers, BrowserProvider } from 'ethers';

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

  // Connect to MetaMask
  async connectMetaMask() {
    if ((window as any).ethereum) {
      try {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
        await this.provider.send('eth_requestAccounts', []);
        const signer = await this.provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Connected with MetaMask: ${address}`);

        // Emit the connected wallet address
        this.walletConnected.emit(address);
      } catch (error) {
        console.error('MetaMask connection failed:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  }

  // Handles email login
  loginWithEmail() {
    console.log(`Logging in with email: ${this.email}`);
    this.toggleModal(); // Close the modal after input
  }
}
