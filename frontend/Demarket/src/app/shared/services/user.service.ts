import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/enviroment.prod';; // Import environment for API base URL

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

// Get user by ID (private)
getUserById(id: string): Observable<any> {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token'); 

  // Define the headers with the Bearer token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Make the GET request with the headers
  return this.http.get<any>(`${environment.apiBaseUrl}/api/users/${id}`, { headers });
}

  // Get public user info by ID
  getUserPublicInfo(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/${id}/public`);
  }

    // Get public user info by WalletAddress
    getUserByWalletAddressPublic(walletAddress: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/by-wallet/${walletAddress}`);
  }

  //PUT update User Profile 
  updateUserProfile(id: string, data: { username?: string; bio?: string; email?: string; links?: string[] }): Observable<any> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token'); 
  
    // Define the headers with the Bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Make the PUT request with the headers and data
    return this.http.put<any>(`${environment.apiBaseUrl}/api/users/${id}`, data, { headers });
  }
  
  
}
