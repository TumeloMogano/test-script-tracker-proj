import { TestBed } from '@angular/core/testing';

import { AspUsersServices } from './aspnetusers';

describe('AspUsersServices', () => {
  let service: AspUsersServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AspUsersServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
