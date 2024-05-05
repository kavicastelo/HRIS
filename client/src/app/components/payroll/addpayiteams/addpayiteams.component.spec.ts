import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpayiteamsComponent } from './addpayiteams.component';

describe('AddpayiteamsComponent', () => {
  let component: AddpayiteamsComponent;
  let fixture: ComponentFixture<AddpayiteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpayiteamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpayiteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
