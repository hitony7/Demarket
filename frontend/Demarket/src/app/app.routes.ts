import { Routes } from '@angular/router';
import { MainpageComponent } from '../app/routes/mainpage/mainpage.component';
import { ListingpageComponent } from  '../app/routes/listingpage/listingpage.component';
import { CreateListingComponent } from '../app/routes/create-listing/create-listing.component'; // Import CreateListingComponent
import { AuthGuard } from '../app/shared/guard/authguard.guard'; // Import the AuthGuard

export const routes: Routes = [
  { path: '', component: MainpageComponent }, // Default route
  { path: 'listings', component: ListingpageComponent },
  { path: 'createlistings', component: CreateListingComponent, canActivate: [AuthGuard] } // Apply AuthGuard here
];
