import { TestBed } from '@angular/core/testing';

import { VenteFirestore } from './vente-firestore';

describe('VenteFirestore', () => {
  let service: VenteFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenteFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
