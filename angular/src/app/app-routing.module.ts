import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/core/auth/auth.guard';
import { StateGuard } from 'src/core/guards/state.guard';
import { environment as env } from 'src/environments/environment';
import { DesktopViewComponent } from './desktop/desktop-view/desktop-view.component';
import { MobileViewComponent } from './mobile/mobile-view/mobile-view.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UnsynchronizedComponent } from './pages/unsynchronized/unsynchronized.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // common pages
  { path: 'login', component: LoginComponent },
  { path: 'company/select', component: CompaniesComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'unsynchronized', component: UnsynchronizedComponent, canActivate: [AuthGuard] },
  // platform-specific
  { path: 'company/dashboard', canActivate: [AuthGuard, StateGuard], component: env.cordova ? MobileViewComponent : DesktopViewComponent },
  // { path: 'company/dashboard', canActivate: [AuthGuard, StateGuard], component: env.cordova ?  DesktopViewComponent :  MobileViewComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
