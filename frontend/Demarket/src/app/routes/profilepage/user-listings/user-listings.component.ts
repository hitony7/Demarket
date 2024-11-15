
import { Component, Input, OnInit,  } from '@angular/core';
import { ListingService } from '../../../shared/services/listings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-listings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="listings mt-8">
      <h2 class="text-2xl font-bold mb-4 text-white">User's Listings</h2>
      <div *ngIf="listings?.length; else noListings" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let listing of listings" class="bg-gray-800 text-white p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2">{{ listing.title }}</h3>
          <p class="text-gray-300">{{ listing.description }}</p>
          <p class="text-yellow-400 font-semibold mt-2">Price: {{ listing.price }} {{ listing.currency }}</p>
        </div>
      </div>
      <ng-template #noListings>
        <p class="text-gray-400">No listings available for this user.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./user-listings.component.scss'],
})
export class UserListingsComponent implements OnInit {
  @Input() userId!: string; // Input to receive the user ID
  listings: any[] = []; // Array to store listings

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
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
}