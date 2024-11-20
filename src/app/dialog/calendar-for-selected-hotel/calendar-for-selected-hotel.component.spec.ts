import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarForSelectedHotelComponent } from './calendar-for-selected-hotel.component';

describe('CalendarForSelectedHotelComponent', () => {
  let component: CalendarForSelectedHotelComponent;
  let fixture: ComponentFixture<CalendarForSelectedHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarForSelectedHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarForSelectedHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
