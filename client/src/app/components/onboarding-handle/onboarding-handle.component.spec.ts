import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingHandleComponent } from './onboarding-handle.component';

describe('OnboardingHandleComponent', () => {
  let component: OnboardingHandleComponent;
  let fixture: ComponentFixture<OnboardingHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingHandleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
