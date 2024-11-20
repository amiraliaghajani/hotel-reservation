import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAvailableHotelComponent } from './all-available-hotel.component';

describe('AllAvailableHotelComponent', () => {
  let component: AllAvailableHotelComponent;
  let fixture: ComponentFixture<AllAvailableHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAvailableHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAvailableHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
