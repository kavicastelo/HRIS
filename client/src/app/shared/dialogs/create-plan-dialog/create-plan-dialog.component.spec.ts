import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanDialogComponent } from './create-plan-dialog.component';

describe('CreatePlanDialogComponent', () => {
  let component: CreatePlanDialogComponent;
  let fixture: ComponentFixture<CreatePlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlanDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
