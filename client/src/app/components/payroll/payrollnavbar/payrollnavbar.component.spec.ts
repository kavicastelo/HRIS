import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollnavbarComponent } from './payrollnavbar.component';

describe('PayrollnavbarComponent', () => {
  let component: PayrollnavbarComponent;
  let fixture: ComponentFixture<PayrollnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollnavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
