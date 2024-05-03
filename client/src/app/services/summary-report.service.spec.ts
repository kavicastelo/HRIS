import { TestBed } from '@angular/core/testing';

import { SummaryReportService } from './summary-report.service';

describe('SummaryReportService', () => {
  let service: SummaryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
