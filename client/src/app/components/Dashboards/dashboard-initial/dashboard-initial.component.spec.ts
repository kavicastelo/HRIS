import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInitialComponent } from './dashboard-initial.component';

describe('DashboardInitialComponent', () => {
  let component: DashboardInitialComponent;
  let fixture: ComponentFixture<DashboardInitialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardInitialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
