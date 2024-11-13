import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and ngStyle
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ListingService } from '../../shared/services/listings.service';

@Component({
  selector: 'app-listingpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './listingpage.component.html',
  styleUrl: './listingpage.component.scss'
})
export class ListingpageComponent implements OnInit  {
  listings: any[] = [];

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.getListings();
  }

  getListings() {
    this.listingService.getListings().subscribe({
      next: (data) => {
        this.listings = data;
        //console.log('Listings fetched successfully:', this.listings); // Verify if listings have data
      },
      error: (error) => {
        console.error('Error fetching listings:', error);
      }
    });
  }
  

  createNewListing() {
    console.log('Create New Listing');
  }

  
}
