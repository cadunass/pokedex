import { TestBed } from '@angular/core/testing';

import { PokeDataService } from './poke-data.service';

describe('PokeDataService', () => {
  let service: PokeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
