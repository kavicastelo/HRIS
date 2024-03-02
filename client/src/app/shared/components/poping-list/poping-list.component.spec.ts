import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopingListComponent } from './poping-list.component';

describe('PopingListComponent', () => {
  let component: PopingListComponent;
  let fixture: ComponentFixture<PopingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
