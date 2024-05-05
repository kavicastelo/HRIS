import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmLmComponent } from './am-lm.component';

describe('AmLmComponent', () => {
  let component: AmLmComponent;
  let fixture: ComponentFixture<AmLmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmLmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmLmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
