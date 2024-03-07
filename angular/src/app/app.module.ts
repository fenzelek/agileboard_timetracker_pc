import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '../core/core.module';
import { DesktopModule } from './desktop/desktop.module';
import { MobileModule } from './mobile/mobile.module';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from "./components/components.module";
import { CngHtmlCompilerModule, JitCompilerModule } from '@codehint-ng/html-compiler';
import { NavigationService } from './services/navigation.service';


@NgModule({
  imports: [
    // core
    CoreModule,

    JitCompilerModule,
    CngHtmlCompilerModule,

    // app
    AppRoutingModule,
    DesktopModule,
    MobileModule,
    PagesModule,
    ComponentsModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  exports: [CngHtmlCompilerModule]
})
export class AppModule {

  constructor(navigationService: NavigationService) { }

}
