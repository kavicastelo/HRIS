import { TestBed } from '@angular/core/testing';

import { BulletingBoardService } from './bulleting-board.service';

describe('BulletingBoardService', () => {
  let service: BulletingBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletingBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
