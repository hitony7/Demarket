import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and ngStyle
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { ListingService } from '../../shared/services/listings.service';
import { AuthService } from '../../shared/services/auth.service'; // Inject AuthService
import { ListingCardComponent } from '../../shared/ui/listing-card/listing-card.component';

@Component({
    selector: 'app-listingpage',
    imports: [
        HeaderComponent,
        FooterComponent,
        RouterModule,
        CommonModule,
        ListingCardComponent,
    ],
    templateUrl: './listingpage.component.html',
    styleUrls: ['./listingpage.component.scss']
})
export class ListingpageComponent implements OnInit {
    categories: string[] = [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports',
      'Health & Beauty',
      'Toys',
      'Automotive',
      'Books',
      'Music',
      'Art',
      'Other',
    ];
    isAuthenticated: boolean = false;
    showTooltip: boolean = false; // Controls tooltip visibility
    selectedCategory: string | null = null;
    listings: any[] = [];
    pagination = {
      currentPage: 1,
      totalPages: 1,
      pageSize: 20,
      totalItems: 0,
    };
  
    constructor(
      private listingService: ListingService,
      private authService: AuthService,
      private router: Router
    ) {}
    ngOnInit() {
      this.getListings();
      
         // Subscribe to authentication status
      this.authService.token$.subscribe((token) => {
        this.isAuthenticated = !!token; // Update authentication state
      });
    }
  
    getListings() {
      const { currentPage, pageSize } = this.pagination;
  
      this.listingService
        .getListings(this.selectedCategory, currentPage, pageSize)
        .subscribe({
          next: (response) => {
            this.listings = response.listings;
            this.pagination.totalPages = response.pagination.totalPages;
            this.pagination.totalItems = response.pagination.totalItems;
          },
          error: (error) => {
            console.error('Error fetching listings:', error);
          },
        });
    }
  
    filterByCategory(category: string | null) {
      this.selectedCategory = category;
      this.pagination.currentPage = 1; // Reset to the first page
      this.getListings();
    }
  
    goToPage(page: number) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page;
        this.getListings();
      }
    }
  
    goToListing = (id: string): void => {
      this.router.navigate(['/listing', id]);
    };
  }