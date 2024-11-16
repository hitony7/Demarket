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
  private apiUrlUser = `${environment.apiBaseUrl}/api/users`;

  constructor(private http: HttpClient) {}

  // Create a listing
  createListing(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token for authorization
    });
    return this.http.post(`${this.apiUrl}`, formData, { headers });
  }

    // Get all listings
    getListings(category: string | null, page: number, pageSize: number): Observable<any> {
      const params: any = { page, pageSize };
      if (category) params.category = category;
  
      return this.http.get<any>(this.apiUrl, { params });
    }
    //Single Listing
    getListingById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`); // Use template literals for URL
    }
    
    //Get All listing by User ID 
    getListingsByUserId(id :string): Observable<any> {
      return this.http.get(`${this.apiUrlUser}/${id}/listings`);

    } 
}
