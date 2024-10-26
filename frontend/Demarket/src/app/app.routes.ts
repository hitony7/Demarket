import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ListingpageComponent } from './listingpage/listingpage.component';
import { CreateListingComponent } from './create-listing/create-listing.component'; // Import CreateListingComponent
import { AuthGuard } from '../app/authguard.guard'; // Import the AuthGuard

export const routes: Routes = [
  { path: '', component: MainpageComponent }, // Default route
  { path: 'listings', component: ListingpageComponent },
  { path: 'createlistings', component: CreateListingComponent, canActivate: [AuthGuard] } // Apply AuthGuard here
];
