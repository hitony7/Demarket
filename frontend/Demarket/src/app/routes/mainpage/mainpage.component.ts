import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

}
