import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingOptionsComponent } from './posting-options.component';

describe('PostingOptionsComponent', () => {
  let component: PostingOptionsComponent;
  let fixture: ComponentFixture<PostingOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
