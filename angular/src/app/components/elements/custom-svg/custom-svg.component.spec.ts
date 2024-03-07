import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSvgComponent } from './custom-svg.component';

describe('CustomSvgComponent', () => {
  let component: CustomSvgComponent;
  let fixture: ComponentFixture<CustomSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
