import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { UserListingsPrivateComponent } from './user-listings-private/user-listings-private.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Import the gear icon
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, UserListingsPrivateComponent, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  faCog = faCog; // Define the icon
  
navigateToEditProfile() {
  this.router.navigate([`/settings`]); //private profile 
}
  user:any;
  userId: string | null = null;
  userName: string | undefined;
  wallet: string[] | undefined;
  rep: number | undefined;
  dateJoined: Date | undefined;
  bio: string | undefined;
  links: string | undefined;
  activeTab: string | undefined;

  constructor(private authService: AuthService, private userService: UserService, private router: Router){}



  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Fetch from JWT or session
  
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (data) => {
          this.user = data;
          this.userName = data.username;
          this.wallet = data.wallet;
          this.rep = data.rep || 0;
          this.dateJoined = data.dateJoined ? new Date(data.dateJoined) : undefined;
          this.bio = data.bio;
          this.links = data.links;
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
        },
      });
    } else {
      console.error('User is not authenticated');
    }
  }

  setActiveTab(tab: 'listings' | 'history'): void {
    this.activeTab = tab;
  }

  formatExternalLink(link: string | undefined): string {
    if (!link) {
      return '#'; // Return a fallback if the link is undefined
    }
    // Add "https://" if the link doesn't start with a protocol
    return link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
  }

}