import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTextComponent } from './post-text.component';

describe('PostTextComponent', () => {
  let component: PostTextComponent;
  let fixture: ComponentFixture<PostTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
