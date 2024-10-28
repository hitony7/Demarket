import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listingpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './listingpage.component.html',
  styleUrl: './listingpage.component.scss'
})
export class ListingpageComponent {


  createNewListing() {
    console.log('Create New Listing');
  }

  
}
