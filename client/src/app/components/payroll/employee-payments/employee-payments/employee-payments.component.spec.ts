import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaymentsComponent } from './employee-payments.component';

describe('EmployeePaymentsComponent', () => {
  let component: EmployeePaymentsComponent;
  let fixture: ComponentFixture<EmployeePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
