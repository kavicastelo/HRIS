import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesConfigDialogComponent } from './leaves-config-dialog.component';

describe('LeavesConfigDialogComponent', () => {
  let component: LeavesConfigDialogComponent;
  let fixture: ComponentFixture<LeavesConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesConfigDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
