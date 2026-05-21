// services/listing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod'; // Import the environment to manage the API URL
import { Listing, ListingPage } from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = `${environment.apiBaseUrl}/api/listings`;
  private apiUrlUser = `${environment.apiBaseUrl}/api/users`;

  constructor(private http: HttpClient) {}

  // Create a listing
  createListing(formData: FormData): Observable<Listing> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token for authorization
    });
    return this.http.post<Listing>(`${this.apiUrl}`, formData, { headers });
  }

    // Get all listings
    getListings(category: string | null, page: number, pageSize: number): Observable<ListingPage> {
      const params: Record<string, string | number> = { page, pageSize };
      if (category) params['category'] = category;
  
      return this.http.get<ListingPage>(this.apiUrl, { params });
    }
    //Single Listing
    getListingById(id: string): Observable<Listing> {
      return this.http.get<Listing>(`${this.apiUrl}/${id}`); // Use template literals for URL
    }
    
    //Get All listing by User ID 
    getListingsByUserId(id :string): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${this.apiUrlUser}/${id}/listings`);

    } 
}
