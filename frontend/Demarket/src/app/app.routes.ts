import { Routes } from '@angular/router';
import { MainpageComponent } from '../app/routes/mainpage/mainpage.component';
import { ListingpageComponent } from  '../app/routes/listingpage/listingpage.component';
import { CreateListingComponent } from '../app/routes/create-listing/create-listing.component'; // Import CreateListingComponent
import { ListingComponent } from './routes/listing/listing.component';
import { ProfilepageComponent } from './routes/profilepage/profilepage.component';
import { AuthGuard } from '../app/shared/guard/authguard.guard'; // Import the AuthGuard
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { SettingsPageComponent } from './routes/dashboard/settings-page/settings-page.component';

export const routes: Routes = [
  { path: '', component: MainpageComponent }, // Default route
  { path: 'listings', component: ListingpageComponent }, //Main Listing Page shows All
  { path: 'listing/:id', component: ListingComponent }, //Listing item page by id
  { path: 'createlistings', component: CreateListingComponent, canActivate: [AuthGuard] }, // Apply AuthGuard here
  { path: 'profile/:id', component: ProfilepageComponent }, //Public profile
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}, // Private profile
  { path: 'settings', component: SettingsPageComponent} //Private User Settings
];
