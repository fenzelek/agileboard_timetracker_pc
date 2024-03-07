import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFooterLeftComponent } from './desktop-footer-left.component';

describe('DesktopFooterLeftComponent', () => {
  let component: DesktopFooterLeftComponent;
  let fixture: ComponentFixture<DesktopFooterLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopFooterLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopFooterLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
