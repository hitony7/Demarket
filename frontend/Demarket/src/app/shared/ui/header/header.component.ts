import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LoginBoxComponent } from '../../ui/loginbox/loginbox.component';
import { WalletService } from '../../services/wallet.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [LoginBoxComponent, CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    // State Variables
    isModalOpen = false; // Controls login modal visibility
    isDropdownOpen = false; // Controls dropdown visibility
    walletAddress: string | null = null; // Stores the connected wallet address
    isAuthenticate = false;
  
    constructor(
       private walletService: WalletService,
       private userService: UserService,
       private authService: AuthService, 
       private router: Router) {}
  
  
  goToProfile(): void {
    const walletAddress = localStorage.getItem('walletAddress');
    if (walletAddress) {
      this.userService.getUserByWalletAddressPublic(walletAddress).subscribe({
        next: (user) => {
          const userId = user._id; // Assuming `_id` is the user's ID
          this.router.navigate([`/dashboard`]); //private profile 
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
    } else {
      console.error('No wallet address found in local storage');
    }
  }

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
  // Use service to clear wallet address and JWT
    this.authService.logout();
    this.isDropdownOpen = false;
  }
}
