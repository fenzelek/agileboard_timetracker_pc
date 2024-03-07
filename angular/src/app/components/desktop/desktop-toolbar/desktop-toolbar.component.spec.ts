import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopToolbarComponent } from './desktop-toolbar.component';

describe('DesktopToolbarComponent', () => {
  let component: DesktopToolbarComponent;
  let fixture: ComponentFixture<DesktopToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
