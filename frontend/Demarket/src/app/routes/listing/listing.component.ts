

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { CommonModule } from '@angular/common';


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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the item id from the route
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    
    // Replace this with a service call to fetch the item by ID
    this.fetchListingDetails(this.itemId);
  }

  fetchListingDetails(id: string) {
    // This is a placeholder for the actual data fetching logic.
    // Replace with service that fetches item details based on id.
    this.item = {
      id: id,
      title: 'Sample Item',
      description: 'This is a detailed description of the item.',
      price: '100',
      currency: 'USD',
      image: 'path/to/image.jpg',
    };
  }

}
