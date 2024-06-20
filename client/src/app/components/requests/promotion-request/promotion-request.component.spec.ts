import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRequestComponent } from './promotion-request.component';

describe('PromotionRequestComponent', () => {
  let component: PromotionRequestComponent;
  let fixture: ComponentFixture<PromotionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
