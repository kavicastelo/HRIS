import { TestBed } from '@angular/core/testing';

import { PayrollReportService } from './payroll-report.service';

describe('PayrollReportService', () => {
  let service: PayrollReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
