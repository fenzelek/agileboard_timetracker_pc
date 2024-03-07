import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTimerComponent } from './desktop-timer.component';

describe('DesktopTimerComponent', () => {
  let component: DesktopTimerComponent;
  let fixture: ComponentFixture<DesktopTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
