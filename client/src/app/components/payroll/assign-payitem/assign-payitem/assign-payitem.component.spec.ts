import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPayitemComponent } from './assign-payitem.component';

describe('AssignPayitemComponent', () => {
  let component: AssignPayitemComponent;
  let fixture: ComponentFixture<AssignPayitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPayitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPayitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
