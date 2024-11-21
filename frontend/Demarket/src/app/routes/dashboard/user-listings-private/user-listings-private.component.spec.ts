import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListingsPrivateComponent } from './user-listings-private.component';

describe('UserListingsComponent', () => {
  let component: UserListingsPrivateComponent;
  let fixture: ComponentFixture<UserListingsPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListingsPrivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListingsPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
