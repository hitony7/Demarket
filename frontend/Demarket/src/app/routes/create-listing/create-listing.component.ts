import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { CommonModule } from '@angular/common';

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

    constructor(private fb: FormBuilder, private http: HttpClient) {
      this.listingForm = this.fb.group({
        saleType: ['', Validators.required],
        title: ['', Validators.required],
        category: ['', Validators.required],
        description: ['', Validators.required],
        image: [null, Validators.required],
        price: [null, Validators.required],
        currency: ['', Validators.required],
        bidDuration: [null]
      });
    }

    ngOnInit(): void {}


    onSubmit() {
      if (this.listingForm.valid) {
        const formData = new FormData();
        Object.keys(this.listingForm.controls).forEach(key => {
          formData.append(key, this.listingForm.get(key)?.value);
        });
  
        this.http.post('https://your-backend-api.com/listings', formData).subscribe(
          (response) => {
            console.log('Listing created successfully', response);
          },
          (error) => {
            console.error('Error creating listing', error);
          }
        );
      }
    }

    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.listingForm.patchValue({ image: file });
      }
    }


    // Toggles the sale type (standard or bid) and shows/hides the bid duration field
    toggleSaleType(event: any) {
      const saleType = event.target.value;
      const bidDurationSection = document.getElementById('bidDurationSection');
  
      if (saleType === 'bid') {
        bidDurationSection!.style.display = 'block';
      } else {
        bidDurationSection!.style.display = 'none';
      }
    }

}
