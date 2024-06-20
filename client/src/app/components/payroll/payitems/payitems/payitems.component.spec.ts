import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayitemsComponent } from './payitems.component';

describe('PayitemsComponent', () => {
  let component: PayitemsComponent;
  let fixture: ComponentFixture<PayitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayitemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
