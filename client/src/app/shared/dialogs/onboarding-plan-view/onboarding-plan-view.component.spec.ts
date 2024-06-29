import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingPlanViewComponent } from './onboarding-plan-view.component';

describe('OnboardingPlanViewComponent', () => {
  let component: OnboardingPlanViewComponent;
  let fixture: ComponentFixture<OnboardingPlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingPlanViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
