
import { Component, Input, OnInit,  } from '@angular/core';
import { ListingService } from '../../../shared/services/listings.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { Listing } from '../../../shared/models/listing.model';

@Component({
    selector: 'app-user-listings',
    imports: [CommonModule],
    templateUrl: './user-listings.component.html',
    styleUrls: ['./user-listings.component.scss']
})
export class UserListingsComponent implements OnInit {
  @Input() userId!: string; // Input to receive the user ID
  listings: Listing[] = []; // Array to store listings

  constructor(private listingService: ListingService, private router: Router) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchUserListings();
    }
  }

  fetchUserListings(): void {
    this.listingService.getListingsByUserId(this.userId).subscribe({
      next: (data) => {
        this.listings = data;
      },
      error: (err) => {
        console.error('Error fetching user listings:', err);
      },
    });
  }

  goToListing(listingId: string): void {
    this.router.navigate([`/listing/${listingId}`]); // Navigate to the listing detail page
  }
}
