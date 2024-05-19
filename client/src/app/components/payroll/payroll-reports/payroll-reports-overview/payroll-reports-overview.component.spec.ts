import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollReportsOverviewComponent } from './payroll-reports-overview.component';

describe('PayrollReportsOverviewComponent', () => {
  let component: PayrollReportsOverviewComponent;
  let fixture: ComponentFixture<PayrollReportsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollReportsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollReportsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
