import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { CommonModule } from '@angular/common';
import { ListingService } from '../../shared/services/listings.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {
  listingForm: FormGroup;
  saleType: string = '';

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService // Inject the ListingService
  ) {
    this.listingForm = this.fb.group({
      saleType: ['', Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      price: [null, [Validators.required, Validators.min(0.01)]],
      currency: ['', Validators.required],
      bidDuration: [null],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log("Submitting Listing");

    if (this.listingForm.invalid) {
      //console.log("Form is invalid");
      this.listingForm.markAllAsTouched(); // Show errors for all fields if invalid
      return;
    }
  
    const formData = new FormData();
    let isEmpty = true; // Track if formData is empty
  
    Object.keys(this.listingForm.controls).forEach((key) => {
      const value = this.listingForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
        isEmpty = false; // Set to false if at least one field is added
        //console.log(`FormData entry added - ${key}:`, value);
      } else {
        console.log(`Field ${key} is missing or empty`); // Log fields that are not added to FormData
      }
    });
    // Final check if formData is empty
    if (isEmpty) {
      console.error("FormData is empty, aborting submission");
      return;
    }
  

    
    this.listingService.createListing(formData).subscribe({
      next: (response) => {
        console.log('Listing created successfully', response);
        // Add any additional success handling here
      },
      error: (error) => {
        console.error('Error creating listing', error);
        // Handle the error here, possibly display an error message
      },
      complete: () => {
        console.log('Request complete');
        // Optional: any actions to take when the observable completes
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.listingForm.patchValue({ image: file });
    }
  }

  toggleSaleType(event: any) {
    const saleType = event.target.value;
    if (saleType === 'bid') {
      this.listingForm.get('bidDuration')?.setValidators([Validators.required]);
    } else {
      this.listingForm.get('bidDuration')?.clearValidators();
    }
    this.listingForm.get('bidDuration')?.updateValueAndValidity();
  }
}