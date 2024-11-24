import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { CommonModule } from '@angular/common';
import { ListingService } from '../../shared/services/listings.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-listing',
    imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './create-listing.component.html',
    styleUrls: ['./create-listing.component.scss']
})
export class CreateListingComponent implements OnInit {
  listingForm: FormGroup;
  saleType: string = '';

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService, // Inject the ListingService
    private router: Router // Inject Router
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


  resetForm(): void {
    this.listingForm.reset();
  }
  
  onSubmit() {
    console.log('Submitting Listing');
  
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched(); // Show errors for all invalid fields
      return;
    }
  
    const formData = new FormData();
  
    Object.keys(this.listingForm.controls).forEach((key) => {
      const value = this.listingForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    this.listingService.createListing(formData).subscribe({
      next: (response) => {
        console.log('Listing created successfully', response);
  
        const listingId = response.id;
  
        this.router.navigate([`/listing/${listingId}`]).then(() => {
          alert('Listing created successfully!');
        });
      },
      error: (error) => {
        console.error('Error creating listing', error);
        alert('Failed to create the listing. Please try again.');
      },
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