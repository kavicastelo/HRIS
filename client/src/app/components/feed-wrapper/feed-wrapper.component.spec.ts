import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedWrapperComponent } from './feed-wrapper.component';

describe('FeedWrapperComponent', () => {
  let component: FeedWrapperComponent;
  let fixture: ComponentFixture<FeedWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
