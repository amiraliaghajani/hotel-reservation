import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedHotelComponent } from './selected-hotel.component';

describe('SelectedHotelComponent', () => {
  let component: SelectedHotelComponent;
  let fixture: ComponentFixture<SelectedHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
