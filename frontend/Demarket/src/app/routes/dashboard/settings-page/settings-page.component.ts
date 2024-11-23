import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/ui/header/header.component";
import { FooterComponent } from "../../../shared/ui/footer/footer.component";
import { NotificationsComponent } from './tabs/notifications/notifications.component';
import { OffersComponent } from './tabs/offers/offers.component';
import { ProfileComponent } from './tabs/profile/profile.component';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './tabs/support/support.component';
@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NotificationsComponent, SupportComponent, ProfileComponent, OffersComponent, CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  activeTab: string = 'profile'; // Default tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  username: string = '';
  bio: string = '';
  email: string = '';
  links: string = '';
  walletAddress: string = '0x71df...3bae';

  onSave() {
    console.log('Saved Settings:', {
      username: this.username,
      bio: this.bio,
      email: this.email,
      links: this.links,
      walletAddress: this.walletAddress,
    });
  }

}
