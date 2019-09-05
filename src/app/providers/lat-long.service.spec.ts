import { TestBed } from '@angular/core/testing';

import { LatLongService } from './lat-long.service';

describe('LatLongService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LatLongService = TestBed.get(LatLongService);
    expect(service).toBeTruthy();
  });
});
