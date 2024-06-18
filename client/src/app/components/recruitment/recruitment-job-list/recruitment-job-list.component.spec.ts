import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentJobListComponent } from './recruitment-job-list.component';

describe('RecruitmentJobListComponent', () => {
  let component: RecruitmentJobListComponent;
  let fixture: ComponentFixture<RecruitmentJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentJobListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
