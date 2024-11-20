import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingReservationTableComponent } from './all-pending-reservation-table.component';

describe('AllPendingReservationTableComponent', () => {
  let component: AllPendingReservationTableComponent;
  let fixture: ComponentFixture<AllPendingReservationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPendingReservationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPendingReservationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
