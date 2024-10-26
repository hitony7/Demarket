import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginBoxComponent } from '../loginbox/loginbox.component';
import { WalletService } from '../../wallet.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginBoxComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // State Variables
  isModalOpen = false; // Controls login modal visibility
  isDropdownOpen = false; // Controls dropdown visibility
  walletAddress: string | null = null; // Stores the connected wallet address

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    // Subscribe to wallet address changes
    this.walletService.walletAddress$.subscribe(address => {
      this.walletAddress = address;
    });
  }

  // Toggles the login modal visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  // Toggles the dropdown visibility
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Handles wallet connection from LoginBoxComponent
  handleWalletConnect(address: string) {
    this.walletService.setWalletAddress(address); // Use service to set wallet address
    this.isModalOpen = false;
    this.isDropdownOpen = false;
  }

  // Logs out the user
  logout() {
    this.walletService.clearWalletAddress(); // Use service to clear wallet address
    this.isDropdownOpen = false;
  }
}
