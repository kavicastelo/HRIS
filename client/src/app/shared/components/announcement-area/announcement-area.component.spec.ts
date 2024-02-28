import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementAreaComponent } from './announcement-area.component';

describe('AnnouncementAreaComponent', () => {
  let component: AnnouncementAreaComponent;
  let fixture: ComponentFixture<AnnouncementAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
