import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopViewComponent } from './desktop-view/desktop-view.component';
import { ComponentsModule } from '../components/components.module';
import { CoreModule } from '../../core/core.module';
import { PagesModule } from '../pages/pages.module';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ComponentsModule,
    PagesModule,
  ],
  declarations: [
    DesktopViewComponent
  ],
  exports: [
    DesktopViewComponent
  ],
})
export class DesktopModule { }
