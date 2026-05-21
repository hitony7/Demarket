import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCardComponent } from './listing-card.component';

describe('ListingCardComponent', () => {
  let component: ListingCardComponent;
  let fixture: ComponentFixture<ListingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingCardComponent);
    component = fixture.componentInstance;
    component.listing = {
      id: 'listing-id',
      title: 'Test listing',
      price: 1,
      currency: 'ETH',
    };
    component.goToListing = () => {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
