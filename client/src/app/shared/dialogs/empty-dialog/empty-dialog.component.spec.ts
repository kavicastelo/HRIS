import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyDialogComponent } from './empty-dialog.component';

describe('PostImageComponent', () => {
  let component: EmptyDialogComponent;
  let fixture: ComponentFixture<EmptyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
