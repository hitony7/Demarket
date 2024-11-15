import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environment/environment'; // Import environment for API base URL

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  // Get user by ID (private)
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/${id}`);
  }

  // Get public user info by ID
  getUserPublicInfo(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/${id}/public`);
  }

    // Get public user info by WalletAddress
    getUserByWalletAddressPublic(walletAddress: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/by-wallet/${walletAddress}`);
  }
  
  
}
