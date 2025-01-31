import { TestBed } from '@angular/core/testing';

import { TestScriptsServices } from './testscripts.services';

describe('TestScriptsServices', () => {
  let service: TestScriptsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestScriptsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});