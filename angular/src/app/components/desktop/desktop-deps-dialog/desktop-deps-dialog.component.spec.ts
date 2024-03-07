import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDepsDialogComponent } from './desktop-deps-dialog.component';

describe('DesktopDepsDialogComponent', () => {
  let component: DesktopDepsDialogComponent;
  let fixture: ComponentFixture<DesktopDepsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopDepsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopDepsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
