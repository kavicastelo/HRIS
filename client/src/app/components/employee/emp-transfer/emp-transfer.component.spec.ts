import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTransferComponent } from './emp-transfer.component';

describe('EmpTransferComponent', () => {
  let component: EmpTransferComponent;
  let fixture: ComponentFixture<EmpTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
