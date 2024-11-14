// services/listing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment'; // Import the environment to manage the API URL

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = `${environment.apiBaseUrl}/api/listing`;

  constructor(private http: HttpClient) {}

  // Create a listing
  createListing(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token for authorization
    });
    return this.http.post(`${this.apiUrl}`, formData, { headers });
  }

    // Get all listings
    getListings(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    getListingById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`); // Use template literals for URL
    }
}
