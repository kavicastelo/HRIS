import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayrollReportsComponent } from './view-payroll-reports.component';

describe('ViewPayrollReportsComponent', () => {
  let component: ViewPayrollReportsComponent;
  let fixture: ComponentFixture<ViewPayrollReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayrollReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPayrollReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
