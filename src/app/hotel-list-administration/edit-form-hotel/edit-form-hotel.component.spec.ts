import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormHotelComponent } from './edit-form-hotel.component';

describe('EditFormHotelComponent', () => {
  let component: EditFormHotelComponent;
  let fixture: ComponentFixture<EditFormHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFormHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
