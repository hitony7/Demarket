

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../shared/services/listings.service';


@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {
  itemId!: string;
  item: any;

  constructor(private route: ActivatedRoute, private listingService: ListingService) {}

  ngOnInit(): void {
    // Get the item ID from the route
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    
    // Fetch the item details using the service
    this.fetchListingDetails(this.itemId);
  }

  fetchListingDetails(id: string) {
    // Use the listing service to fetch item details based on ID
    this.listingService.getListingById(id).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (err) => {
        console.error('Error fetching listing details:', err);
      }
    });
  }
}