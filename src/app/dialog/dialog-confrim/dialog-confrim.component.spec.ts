import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfrimComponent } from './dialog-confrim.component';

describe('DialogConfrimComponent', () => {
  let component: DialogConfrimComponent;
  let fixture: ComponentFixture<DialogConfrimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfrimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
