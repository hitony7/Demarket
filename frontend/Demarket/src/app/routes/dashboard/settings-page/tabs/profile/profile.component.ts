import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../../../../shared/models/user.model';
import { UserService } from '../../../../../shared/services/user.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: User | null;
  profileForm!: FormGroup; // FormGroup to manage form fields
  isLoading: boolean = false; // Loading state for better UX
  updateSuccess: boolean | null = null; // Tracks update status for feedback
  

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder, // Inject FormBuilder
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    // Initialize form with custom validation
    this.profileForm = this.fb.group(
      {
        username: ['', [Validators.minLength(4), Validators.maxLength(15)]], // Username must be at least 4 characters if provided Max 15
        bio: ['', [Validators.maxLength(250)]],    //Max of 250 characters
        email: ['', Validators.email], // Email must be valid if provided
        links: ['']
      },
      { validators: this.atLeastOneFieldValidator(['username', 'bio', 'email', 'links']) } // Custom validator
    );

    // Fetch user data
    const userId = this.authService.getUserId();
    if (userId) {
      this.fetchUserData(userId);
    } else {
     // console.error('User ID is missing. Redirecting to login...');
    }
  }

  // Fetch user data and populate form
  fetchUserData(userId: string): void {
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.populateForm(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.isLoading = false;
      }
    });
  }

  // Populate form fields
  populateForm(user: User): void {
    this.profileForm.patchValue({
      username: user.username,
      bio: user.bio || '',
      email: user.email,
      links: user.links|| ''
    });
  }

  // Custom validator to ensure at least one field is filled
  private atLeastOneFieldValidator(fields: string[]): ValidatorFn {
    return (form: AbstractControl): { [key: string]: any } | null => {
      const isAnyFieldFilled = fields.some((field) => {
        const value = form.get(field)?.value;
        return value && value.trim() !== '';
      });

      return isAnyFieldFilled ? null : { atLeastOneFieldRequired: true };
    };
  }

  // Handle form submission
  onSubmit(): void {
    if (this.profileForm.invalid) {
      console.error('Form validation failed. Please correct errors and try again.');
      return;
    }

    const formData = this.profileForm.value;

    if (this.user?._id) {
      this.isLoading = true;
      this.userService.updateUserProfile(this.user._id, formData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.updateSuccess = true;
          this.isLoading = false;
          alert('Profile updated successfully');
              // Refresh the current route
          this.router.navigateByUrl('/settings', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
          });
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.updateSuccess = false;
          this.isLoading = false;
        }
      });
    }
  }
}