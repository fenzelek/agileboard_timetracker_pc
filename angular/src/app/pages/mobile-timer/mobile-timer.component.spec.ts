import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTimerComponent } from './mobile-timer.component';

describe('MobileTimmerBoxComponent', () => {
  let component: MobileTimerComponent;
  let fixture: ComponentFixture<MobileTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
