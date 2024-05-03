import { TestBed } from '@angular/core/testing';

import { PayitemService } from './payitem.service';

describe('PayitemService', () => {
  let service: PayitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
