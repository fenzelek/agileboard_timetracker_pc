import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { ComponentsModule } from '../components/components.module';
import { CoreModule } from 'src/core/core.module';
import { LoginComponent } from './login/login.component';
import { CompaniesComponent } from './companies/companies.component';
import { MobileProjectsComponent } from "./mobile-projects/mobile-projects.component";
import { MobileTasksComponent } from "./mobile-tasks/mobile-tasks.component";
import { MobileTimerComponent } from "./mobile-timer/mobile-timer.component";
import { RouterModule } from "@angular/router";
import { MobileTimesComponent } from './mobile-times/mobile-times.component';
import { UnsynchronizedComponent } from './unsynchronized/unsynchronized.component';


@NgModule({
  imports: [
    CoreModule,
    ComponentsModule,
    RouterModule,
  ],
  declarations: [
    LoginComponent,
    CompaniesComponent,
    SettingsComponent,
    MobileProjectsComponent,
    MobileTasksComponent,
    MobileTimerComponent,
    MobileTimesComponent,
    UnsynchronizedComponent,
  ],
  exports: [
    LoginComponent,
    CompaniesComponent,
    SettingsComponent,
    MobileProjectsComponent,
    MobileTasksComponent,
    MobileTimerComponent,
    MobileTimesComponent,
  ],
})
export class PagesModule { }
