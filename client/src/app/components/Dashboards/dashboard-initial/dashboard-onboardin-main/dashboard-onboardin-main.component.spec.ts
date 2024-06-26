import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOnboardinMainComponent } from './dashboard-onboardin-main.component';

describe('DashboardOnboardinMainComponent', () => {
  let component: DashboardOnboardinMainComponent;
  let fixture: ComponentFixture<DashboardOnboardinMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardOnboardinMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOnboardinMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
