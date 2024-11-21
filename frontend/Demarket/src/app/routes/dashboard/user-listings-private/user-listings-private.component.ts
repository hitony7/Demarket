
import { Component, Input, OnInit,  } from '@angular/core';
import { ListingService } from '../../../shared/services/listings.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-user-listings-private',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-listings-private.component.html',
  styleUrls: ['./user-listings-private.component.scss'],
})
export class UserListingsPrivateComponent implements OnInit {
  @Input() userId!: string; // Input to receive the user ID
  listings: any[] = []; // Array to store listings

  constructor(private listingService: ListingService, private router: Router) {}

  ngOnInit(): void {
    console.log('User ID from parent:', this.userId);
    this.fetchUserListings();
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