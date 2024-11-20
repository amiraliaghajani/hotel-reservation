import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCommentComponent } from './pending-comment.component';

describe('PendingCommentComponent', () => {
  let component: PendingCommentComponent;
  let fixture: ComponentFixture<PendingCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
