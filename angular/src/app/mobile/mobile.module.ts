import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileViewComponent } from './mobile-view/mobile-view.component';
import { ComponentsModule } from '../components/components.module';
import { CoreModule } from 'src/core/core.module';
import { PagesModule } from "../pages/pages.module";


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ComponentsModule,
    PagesModule,
  ],
  declarations: [
    MobileViewComponent
  ],
  exports: [
    MobileViewComponent
  ],
})
export class MobileModule { }
