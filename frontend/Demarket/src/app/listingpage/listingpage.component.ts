import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-listingpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './listingpage.component.html',
  styleUrl: './listingpage.component.scss'
})
export class ListingpageComponent {

}
