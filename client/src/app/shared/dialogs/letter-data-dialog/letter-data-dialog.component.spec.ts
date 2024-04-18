import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterDataDialogComponent } from './letter-data-dialog.component';

describe('LetterDataDialogComponent', () => {
  let component: LetterDataDialogComponent;
  let fixture: ComponentFixture<LetterDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetterDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
