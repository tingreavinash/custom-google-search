import { TestBed } from '@angular/core/testing';

import { GooglesearchService } from './googlesearch.service';

describe('GooglesearchService', () => {
  let service: GooglesearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglesearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
