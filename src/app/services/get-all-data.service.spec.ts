import { TestBed } from '@angular/core/testing';

import { GetAllDataService } from './get-all-data.service';

describe('GetAllDataService', () => {
  let service: GetAllDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
