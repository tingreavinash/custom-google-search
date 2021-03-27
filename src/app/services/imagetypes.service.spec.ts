import { TestBed } from '@angular/core/testing';

import { ImagetypesService } from './imagetypes.service';

describe('ImagetypesService', () => {
  let service: ImagetypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagetypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
