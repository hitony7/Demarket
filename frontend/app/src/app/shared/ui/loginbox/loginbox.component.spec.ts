import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBoxComponent } from './loginbox.component';

describe('LoginboxComponent', () => {
  let component: LoginBoxComponent;
  let fixture: ComponentFixture<LoginBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
