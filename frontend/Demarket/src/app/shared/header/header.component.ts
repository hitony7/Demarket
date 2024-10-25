import { Component } from '@angular/core';
import { LoginBoxComponent } from '../loginbox/loginbox.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginBoxComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isModalOpen = false; // Modal visibility state
  walletAddress: string | null = null; // Store the connected wallet address

  // Handle wallet connection from child component
  handleWalletConnect(address: string) {
    this.walletAddress = address; // Update wallet address
  }

  // Toggles the modal's visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

}
