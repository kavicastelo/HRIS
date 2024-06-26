import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollConfigurationComponent } from './payroll-configuration.component';

describe('PayrollConfigurationComponent', () => {
  let component: PayrollConfigurationComponent;
  let fixture: ComponentFixture<PayrollConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
