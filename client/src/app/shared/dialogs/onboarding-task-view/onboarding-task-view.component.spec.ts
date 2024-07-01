import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTaskViewComponent } from './onboarding-task-view.component';

describe('OnboardingTaskViewComponent', () => {
  let component: OnboardingTaskViewComponent;
  let fixture: ComponentFixture<OnboardingTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingTaskViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
