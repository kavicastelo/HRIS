import { TestBed } from '@angular/core/testing';

import { OnboardinService } from './onboardin.service';

describe('OnboardinService', () => {
  let service: OnboardinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
