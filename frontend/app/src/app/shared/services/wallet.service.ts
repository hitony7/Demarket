import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available globally
})
export class WalletService {
  // BehaviorSubject to hold the current wallet address
  private walletAddressSubject = new BehaviorSubject<string | null>(null);

  // Observable to provide wallet address updates
  walletAddress$ = this.walletAddressSubject.asObservable();

  constructor() {
    // Check if a wallet address exists in localStorage during initialization
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        this.walletAddressSubject.next(savedAddress);
      }
    }
  }

  // Sets the wallet address and saves it to localStorage
  setWalletAddress(address: string) {
    this.walletAddressSubject.next(address);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('walletAddress', address);
    }
  }

  // Clears the wallet address and removes it from localStorage
  clearWalletAddress() {
    this.walletAddressSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('walletAddress');
    }
  }

  // Returns the current wallet address
  getWalletAddress(): string | null {
    return this.walletAddressSubject.value;
  }
}
