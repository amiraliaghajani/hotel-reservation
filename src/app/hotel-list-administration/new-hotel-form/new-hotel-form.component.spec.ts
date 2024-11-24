import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHotelFormComponent } from './new-hotel-form.component';

describe('NewHotelFormComponent', () => {
  let component: NewHotelFormComponent;
  let fixture: ComponentFixture<NewHotelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHotelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHotelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
