import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostViewComponent } from './job-post-view.component';

describe('JobPostViewComponent', () => {
  let component: JobPostViewComponent;
  let fixture: ComponentFixture<JobPostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
