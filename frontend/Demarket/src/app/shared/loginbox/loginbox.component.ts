import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-box',
  standalone: true,
  templateUrl: './loginbox.component.html',
  styleUrls: ['./loginbox.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class LoginBoxComponent {
  @Input() isModalOpen = false; // Accepts modal visibility from parent component
  email = ''; // User email input

  // Toggles the modal's visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  // Handles wallet connection
  connectWallet(walletName: string) {
    console.log(`Connecting with ${walletName}...`);
    // Add wallet connection logic here (e.g., using ethers.js, web3.js)
    this.toggleModal(); // Close the modal after selecting the wallet
  }

  // Handles email login
  loginWithEmail() {
    console.log(`Logging in with email: ${this.email}`);
    // Add email login logic here (e.g., using OAuth or backend call)
    this.toggleModal(); // Close the modal after input
  }
}
