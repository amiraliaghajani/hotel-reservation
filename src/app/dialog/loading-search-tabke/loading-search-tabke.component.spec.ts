import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSearchTabkeComponent } from './loading-search-tabke.component';

describe('LoadingSearchTabkeComponent', () => {
  let component: LoadingSearchTabkeComponent;
  let fixture: ComponentFixture<LoadingSearchTabkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSearchTabkeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSearchTabkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
