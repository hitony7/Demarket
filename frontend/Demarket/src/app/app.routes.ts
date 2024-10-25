import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ListingpageComponent } from './listingpage/listingpage.component';

export const routes: Routes = [
    { path: '', component: MainpageComponent }, // Default route
    { path: 'listings', component: ListingpageComponent },
];
