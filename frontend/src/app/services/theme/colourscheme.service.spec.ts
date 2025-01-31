import { TestBed } from '@angular/core/testing';

import { ColourschemeService } from './colourscheme.service';

describe('ColourschemeService', () => {
  let service: ColourschemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColourschemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
