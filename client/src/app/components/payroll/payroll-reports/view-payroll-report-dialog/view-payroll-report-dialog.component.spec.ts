import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayrollReportDialogComponent } from './view-payroll-report-dialog.component';

describe('ViewPayrollReportDialogComponent', () => {
  let component: ViewPayrollReportDialogComponent;
  let fixture: ComponentFixture<ViewPayrollReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayrollReportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPayrollReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
