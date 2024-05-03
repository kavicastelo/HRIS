import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeePayitemsComponent } from './view-employee-payitems.component';

describe('ViewEmployeePayitemsComponent', () => {
  let component: ViewEmployeePayitemsComponent;
  let fixture: ComponentFixture<ViewEmployeePayitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeePayitemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeePayitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
