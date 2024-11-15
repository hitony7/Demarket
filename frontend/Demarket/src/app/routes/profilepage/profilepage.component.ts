import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service'; // Adjust path as needed
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { ActivatedRoute, Route } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-profilepage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss'
})
export class ProfilepageComponent implements OnInit {
  userName: string | undefined;
  wallet: string[] | undefined;
  rep: number | undefined;
  dateJoined: Date | undefined;
  bio: string | undefined;
  links: string | undefined;


  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Fetch userId from route parameters
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId !== null) {
      // Fetch user details
      this.userService.getUserPublicInfo(userId).subscribe({
        next: (data) => {
          this.userName = data.username;
          this.wallet = data.wallet;
          this.rep = data.rep || 0;
          this.dateJoined = data.dateJoined ? new Date(data.dateJoined) : undefined; // Use `createdAt` as `dateJoined`
          this.bio = data.bio;
          this.links = data.links;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
        complete: () => {
          console.log('User data fetch complete');
        },
      });
    } else {
      console.error('No user ID provided in route parameters');
    }
  }



  formatExternalLink(link: string | undefined): string {
    if (!link) {
      return '#'; // Return a fallback if the link is undefined
    }
    // Add "https://" if the link doesn't start with a protocol
    return link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
  }
}