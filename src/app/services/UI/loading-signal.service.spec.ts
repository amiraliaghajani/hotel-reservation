import { TestBed } from '@angular/core/testing';

import { LoadingSignalService } from './loading-signal.service';

describe('LoadingSignalService', () => {
  let service: LoadingSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
