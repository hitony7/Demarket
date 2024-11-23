import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../shared/models/user.model';
import { UserService } from '../../../../../shared/services/user.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: User | null;

  constructor(private userService: UserService, private authService: AuthService) {}
  
  ngOnInit() {
    // Fetch the user ID from AuthService
    const userId = this.authService.getUserId();
    if (userId) {
      // If user ID is available, fetch user data from UserService
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data; // Assign the fetched user data
        },
        error: (err) => {
          console.error('Error fetching user data:', err); // Log any errors
        },
      });
    } else {
      console.error('User ID is null. Cannot fetch user data.');
      // Optionally redirect the user to the login page or display an error
    }
  }
}


