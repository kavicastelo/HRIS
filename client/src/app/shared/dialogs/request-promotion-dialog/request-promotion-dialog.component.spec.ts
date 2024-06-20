import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPromotionDialogComponent } from './request-promotion-dialog.component';

describe('RequestPromotionDialogComponent', () => {
  let component: RequestPromotionDialogComponent;
  let fixture: ComponentFixture<RequestPromotionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPromotionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPromotionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
