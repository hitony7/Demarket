import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ModalService } from './modal.service'; // Import the ModalService

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private modalService: ModalService) {}

  canActivate(): boolean {
    // Check if running in the browser environment
    if (typeof window !== 'undefined' && localStorage) {
      const walletAddress = localStorage.getItem('walletAddress');
      console.log(walletAddress + "guard")

      if (walletAddress) {
        return true; // Allow navigation if the wallet is connected
      }
    }

    // Show the login modal and block navigation if no wallet is connected
    this.modalService.showModal();
    return false;
  }
}
