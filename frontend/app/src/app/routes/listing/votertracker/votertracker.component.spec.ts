import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotertrackerComponent } from './votertracker.component';

describe('VotertrackerComponent', () => {
  let component: VotertrackerComponent;
  let fixture: ComponentFixture<VotertrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotertrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotertrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
