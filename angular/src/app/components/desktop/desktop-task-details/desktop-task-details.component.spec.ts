import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTaskDetailsComponent } from './desktop-task-details.component';

describe('DesktopTaskDetailsComponent', () => {
  let component: DesktopTaskDetailsComponent;
  let fixture: ComponentFixture<DesktopTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopTaskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
