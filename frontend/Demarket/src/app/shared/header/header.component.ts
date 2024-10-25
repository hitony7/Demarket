import { Component } from '@angular/core';
import { LoginBoxComponent } from '../loginbox/loginbox.component';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginBoxComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  //State Variables
  isModalOpen = false; // Controls modal visibility
  isDropdownOpen = false; // Controls dropdown visibility
  walletAddress: string | null = null; // Stores the connected wallet address

  // Toggles the login modal visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  // Toggles the dropdown visibility
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Handles wallet connection from child component
  handleWalletConnect(address: string) {
    this.walletAddress = address; // Update wallet address
    this.isModalOpen = false; // Close the modal after connection
    this.isDropdownOpen = false; // Close the dropdown if open
  }

  // Logs out the user
  logout() {
    this.walletAddress = null; // Clear the wallet address
    this.isDropdownOpen = false; // Close the dropdown
  }

}
