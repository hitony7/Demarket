import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ModalService } from '../services/modal.service'; // Import the ModalService

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private modalService: ModalService) {}

  canActivate(): boolean {
    // Check if running in the browser environment and localStorage is accessible
    if (typeof window !== 'undefined' && localStorage) {
      const walletAddress = localStorage.getItem('walletAddress');

      if (walletAddress) {
        return true; // Allow navigation if the wallet is connected
      }
    }

    // Show the login modal and block navigation if no wallet is connected
    this.modalService.showModal();
    return false;
  }
}
