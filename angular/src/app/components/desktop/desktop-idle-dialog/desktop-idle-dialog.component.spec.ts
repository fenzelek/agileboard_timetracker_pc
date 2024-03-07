import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopIdleDialogComponent } from './desktop-idle-dialog.component';

describe('DesktopIdleDialogComponent', () => {
  let component: DesktopIdleDialogComponent;
  let fixture: ComponentFixture<DesktopIdleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopIdleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopIdleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
