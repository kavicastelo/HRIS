import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTaxrangeComponent } from './add-new-taxrange.component';

describe('AddNewTaxrangeComponent', () => {
  let component: AddNewTaxrangeComponent;
  let fixture: ComponentFixture<AddNewTaxrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTaxrangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTaxrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
