import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecryptDataComponent } from './decrypt-data.component';

describe('DecryptDataComponent', () => {
  let component: DecryptDataComponent;
  let fixture: ComponentFixture<DecryptDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecryptDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecryptDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
