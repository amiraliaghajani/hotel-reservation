import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelListAdministrationComponent } from './hotel-list-administration.component';

describe('HotelListAdministrationComponent', () => {
  let component: HotelListAdministrationComponent;
  let fixture: ComponentFixture<HotelListAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelListAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelListAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
