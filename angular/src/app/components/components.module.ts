import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../core/core.module';
import { AppRoutingModule } from '../app-routing.module';

import { DesktopToolbarComponent } from './desktop/desktop-toolbar/desktop-toolbar.component';
import { DesktopContentComponent } from './desktop/desktop-content/desktop-content.component';
import { DesktopTimerComponent } from './desktop/desktop-timer/desktop-timer.component';
import { DesktopProjectsComponent } from './desktop/desktop-projects/desktop-projects.component';
import { DesktopTasksComponent } from './desktop/desktop-tasks/desktop-tasks.component';
import { DesktopFooterLeftComponent } from './desktop/desktop-footer-left/desktop-footer-left.component';
import { DesktopTaskDetailsComponent } from './desktop/desktop-task-details/desktop-task-details.component';
import { DesktopIdleDialogComponent } from './desktop/desktop-idle-dialog/desktop-idle-dialog.component';
import { DesktopDepsDialogComponent } from './desktop/desktop-deps-dialog/desktop-deps-dialog.component';
import { DesktopTimesComponent } from './desktop/desktop-times/desktop-times.component';

import { MobileProjectListComponent } from './mobile/mobile-project-list/mobile-project-list.component';
import { MobileToolbarComponent } from "./mobile/mobile-toolbar/mobile-toolbar.component";
import { MobileTaskListComponent } from './mobile/mobile-task-list/mobile-task-list.component';
import { MobileTasksFilterComponent } from './mobile/mobile-tasks-filter/mobile-tasks-filter.component';
import { MobileCreateTaskComponent } from './mobile/mobile-create-task/mobile-create-task.component';

import { BasicFormComponent } from './elements/basic-form/basic-form.component';
import { CustomSvgComponent } from './elements/custom-svg/custom-svg.component';
import { WorkingCompanyBoxComponent } from './elements/working-company-box/working-company-box.component';
import { StaticTwoDirectionBoxComponent } from './elements/static-two-direction-box/static-two-direction-box.component';
import { SelectSearchComponent } from './elements/select-search/select-search.component';
import { MobileTaskDetailsDialogComponent } from "./mobile/mobile-task-details-dialog/mobile-task-details-dialog.component";
import { SpinnerComponent } from './elements/spinner/spinner.component';
import { NoInternetConnectionComponent } from './elements/no-internet-connection/no-internet-connection.component';
import { SelectedProjectBoxComponent } from './elements/selected-project-box/selected-project-box.component';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule,
  ],
  declarations: [
    DesktopToolbarComponent,
    DesktopContentComponent,
    DesktopTimerComponent,
    DesktopProjectsComponent,
    DesktopTasksComponent,
    DesktopFooterLeftComponent,
    DesktopTaskDetailsComponent,
    DesktopIdleDialogComponent,
    DesktopDepsDialogComponent,
    DesktopTimesComponent,
    MobileProjectListComponent,
    MobileToolbarComponent,
    MobileToolbarComponent,
    MobileTaskListComponent,
    MobileTaskDetailsDialogComponent,
    MobileCreateTaskComponent,
    MobileTasksFilterComponent,
    BasicFormComponent,
    CustomSvgComponent,
    SpinnerComponent,
    WorkingCompanyBoxComponent,
    StaticTwoDirectionBoxComponent,
    SelectSearchComponent,
    NoInternetConnectionComponent,
    SelectedProjectBoxComponent,
  ],
  exports: [
    DesktopToolbarComponent,
    DesktopContentComponent,
    DesktopTimerComponent,
    DesktopProjectsComponent,
    DesktopTasksComponent,
    DesktopFooterLeftComponent,
    DesktopTaskDetailsComponent,
    DesktopIdleDialogComponent,
    DesktopDepsDialogComponent,
    DesktopTimesComponent,
    MobileProjectListComponent,
    MobileToolbarComponent,
    MobileToolbarComponent,
    MobileTaskListComponent,
    MobileTaskDetailsDialogComponent,
    MobileCreateTaskComponent,
    MobileTasksFilterComponent,
    BasicFormComponent,
    CustomSvgComponent,
    SpinnerComponent,
    WorkingCompanyBoxComponent,
    StaticTwoDirectionBoxComponent,
    SelectSearchComponent,
    NoInternetConnectionComponent,
    SelectedProjectBoxComponent
  ],
})
export class ComponentsModule { }
