import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayrollScheduleComponent } from './edit-payroll-schedule.component';

describe('EditPayrollScheduleComponent', () => {
  let component: EditPayrollScheduleComponent;
  let fixture: ComponentFixture<EditPayrollScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPayrollScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPayrollScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
