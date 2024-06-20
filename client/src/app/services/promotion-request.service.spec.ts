import { TestBed } from '@angular/core/testing';

import { PromotionRequestService } from './promotion-request.service';

describe('PromotionRequestService', () => {
  let service: PromotionRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
