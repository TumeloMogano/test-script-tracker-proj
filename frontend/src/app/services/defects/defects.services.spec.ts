import { TestBed } from '@angular/core/testing';

import { DefectsServices } from './defects.services';

describe('DefectsServices', () => {
  let service: DefectsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefectsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});