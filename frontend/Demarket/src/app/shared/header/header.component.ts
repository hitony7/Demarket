import { Component } from '@angular/core';
import { LoginBoxComponent } from '../loginbox/loginbox.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginBoxComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isModalOpen = false; // Modal visibility state

  // Toggles the modal's visibility
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

}
