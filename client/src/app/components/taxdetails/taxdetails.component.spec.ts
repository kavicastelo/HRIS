import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxdetailsComponent } from './taxdetails.component';

describe('TaxdetailsComponent', () => {
  let component: TaxdetailsComponent;
  let fixture: ComponentFixture<TaxdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
