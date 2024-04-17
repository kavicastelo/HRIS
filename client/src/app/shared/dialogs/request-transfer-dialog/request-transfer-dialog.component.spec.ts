import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTransferDialogComponent } from './request-transfer-dialog.component';

describe('RequestTransferModelComponent', () => {
  let component: RequestTransferDialogComponent;
  let fixture: ComponentFixture<RequestTransferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTransferDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
