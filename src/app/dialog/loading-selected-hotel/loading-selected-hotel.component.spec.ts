import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSelectedHotelComponent } from './loading-selected-hotel.component';

describe('LoadingSelectedHotelComponent', () => {
  let component: LoadingSelectedHotelComponent;
  let fixture: ComponentFixture<LoadingSelectedHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSelectedHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSelectedHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
