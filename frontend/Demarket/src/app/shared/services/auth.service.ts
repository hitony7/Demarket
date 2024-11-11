// auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { WalletService } from './wallet.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../src/environment/environment'; // Import environment for API base URL

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable for managing authentication token
  private tokenSubject = new BehaviorSubject<string | null>(null);
  // Observable stream for components to subscribe to token changes
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient, // HttpClient for making API requests
    private walletService: WalletService, // WalletService for managing wallet-related logic
    @Inject(PLATFORM_ID) private platformId: Object // Platform ID for checking if code is running on browser or server
  ) {
    // Load saved token from localStorage if it exists and platform is browser
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.tokenSubject.next(savedToken); // Set token from local storage
      }
    }
  }

  /**
   * Sets the authentication token both in the BehaviorSubject and localStorage.
   * @param token - JWT token to be saved.
   */
  setToken(token: string) {
    this.tokenSubject.next(token); // Update the observable token
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token); // Save the token to localStorage
    }
  }

  /**
   * Retrieves the current JWT token from the BehaviorSubject.
   * @returns The current token as a string or null if not set.
   */
  getToken(): string | null {
    return this.tokenSubject.value; // Retrieve the current token
  }

  /**
   * Sends a request to the backend to generate a nonce for signing, based on the wallet address.
   * @param walletAddress - The user's wallet address.
   * @returns A promise with the server's response, containing the nonce.
   */
  async requestNonce(walletAddress: string): Promise<any> {
    return lastValueFrom(
      this.http.post(`${environment.apiBaseUrl}/api/auth/request-nonce`, { walletAddress })
    );
  }

  /**
   * Verifies the user's signature with the backend to complete the authentication process.
   * @param walletAddress - The user's wallet address.
   * @param signature - The signed nonce.
   * @returns A promise with the server's response, containing the JWT token if verification is successful.
   */
  async verifySignature(walletAddress: string, signature: string): Promise<any> {
    return lastValueFrom(
      this.http.post(`${environment.apiBaseUrl}/api/auth/verify-signature`, { walletAddress, signature })
    );
  }

  /**
   * Logs the user out by clearing the token from both local storage and the BehaviorSubject.
   * Additionally, clears the wallet address stored in WalletService.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token'); // Remove the token from localStorage
    }
    this.tokenSubject.next(null); // Clear the token in BehaviorSubject
    this.walletService.clearWalletAddress(); // Clear the wallet address from WalletService
  }
}
