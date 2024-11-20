import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsOptionsComponent } from './widgets-options.component';

describe('WidgetsOptionsComponent', () => {
  let component: WidgetsOptionsComponent;
  let fixture: ComponentFixture<WidgetsOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
