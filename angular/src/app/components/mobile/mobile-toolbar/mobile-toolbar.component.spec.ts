import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileToolbarComponent } from './mobile-toolbar.component';

describe('MobileToolbarComponent', () => {
  let component: MobileToolbarComponent;
  let fixture: ComponentFixture<MobileToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
