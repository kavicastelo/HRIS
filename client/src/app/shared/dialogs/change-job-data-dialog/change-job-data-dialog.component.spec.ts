import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeJobDataDialogComponent } from './change-job-data-dialog.component';

describe('ChangeJobDataDialogComponent', () => {
  let component: ChangeJobDataDialogComponent;
  let fixture: ComponentFixture<ChangeJobDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeJobDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeJobDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
