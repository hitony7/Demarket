import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and ngStyle
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { ListingService } from '../../shared/services/listings.service';
import { ListingCardComponent } from '../../shared/ui/listing-card/listing-card.component';

@Component({
  selector: 'app-listingpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule, ListingCardComponent],
  templateUrl: './listingpage.component.html',
  styleUrl: './listingpage.component.scss'
})
export class ListingpageComponent implements OnInit  {
goToItemDetail(arg0: any) {
throw new Error('Method not implemented.');
}
  listings: any[] = [];

  constructor(private listingService: ListingService, private router: Router) {}

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
  

  goToListing = (id: string) => {
    this.router.navigate(['/listing', id]);
  };

  
}
