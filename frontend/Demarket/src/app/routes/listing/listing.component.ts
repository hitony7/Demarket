

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../shared/services/listings.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { VotertrackerComponent } from './votertracker/votertracker.component';


@Component({
    selector: 'app-listing',
    imports: [FooterComponent, HeaderComponent, CommonModule, VotertrackerComponent],
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {
  itemId!: string;
  item: any;
  seller: any; // Store owner information
  countdown: string | null = null; // Countdown timer display
  saleEndDate: string | null = null; // Formatted sale end date
  countdownSubscription: Subscription | null = null; // Subscription to handle the interval

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the item ID from the route
    this.itemId = this.route.snapshot.paramMap.get('id')!;

    // Fetch the item details using the service
    this.fetchListingDetails(this.itemId);
  }

  fetchListingDetails(id: string) {
    this.listingService.getListingById(id).subscribe({
      next: (data) => {
        this.item = data;

        // Fetch seller details using userId from the item
        if (this.item.sellerId) {
          this.fetchOwnerDetails(this.item.sellerId);
        }

        // Start the countdown timer if sale type is bid
        if (this.item.saleType === 'bid' && this.item.createdAt && this.item.bidDuration) {
          this.startCountdown(this.item.createdAt, this.item.bidDuration);
        }
      },
      error: (err) => {
        console.error('Error fetching listing details:', err);
      }
    });
  }

  fetchOwnerDetails(userId: string) {
    this.userService.getUserPublicInfo(userId).subscribe({
      next: (data) => {
        this.seller = data; // Store owner information
      },
      error: (err) => {
        console.error('Error fetching owner details:', err);
      }
    });
  }

  startCountdown(createdAt: string, bidDurationHours: number): void {
    const endTime = new Date(createdAt).getTime() + bidDurationHours * 60 * 60 * 1000;
    this.saleEndDate = new Date(endTime).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Update every second
    this.countdownSubscription = interval(1000).subscribe(() => {
      const currentTime = Date.now();
      const timeLeft = endTime - currentTime;

      if (timeLeft <= 0) {
        this.countdown = 'Bidding Ended';
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      this.countdown = `${hours}h ${minutes}m ${seconds}s`;
    });
  }

  redirectToProfile(): void {
    if (this.item?.sellerId) {
      this.router.navigate([`/profile/${this.item.sellerId}`]);
    } else {
      console.error('Seller ID is not available');
    }
  }

  getEtherscanLink(wallet: string): string {
    return `https://etherscan.io/address/${wallet}`;
  }

  onBuyNow(): void {
    console.log('BUY NOW button clicked.');
    // Implement the logic for BUY NOW
  }
  
  onMakeOffer(): void {
    console.log('MAKE OFFER button clicked.');
    // Implement the logic for MAKE OFFER
  }

  ngOnDestroy(): void {
    // Cleanup the subscription when the component is destroyed
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}