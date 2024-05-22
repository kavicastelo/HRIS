import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryReportDialogComponent } from './view-summary-report-dialog.component';

describe('ViewSummaryReportDialogComponent', () => {
  let component: ViewSummaryReportDialogComponent;
  let fixture: ComponentFixture<ViewSummaryReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSummaryReportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSummaryReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
