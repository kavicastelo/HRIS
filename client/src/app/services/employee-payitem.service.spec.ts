import { TestBed } from '@angular/core/testing';

import { EmployeePayitemService } from './employee-payitem.service';

describe('EmployeePayitemService', () => {
  let service: EmployeePayitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeePayitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
