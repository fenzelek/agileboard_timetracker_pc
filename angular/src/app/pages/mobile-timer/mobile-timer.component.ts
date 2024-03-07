import { ChangeDetectorRef, Component } from '@angular/core';
import { TasksFacade } from "../../../core/store/tasks/tasks.facade";
import { MatDialog } from "@angular/material/dialog";
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { DesktopTimerComponent } from 'src/app/components/desktop/desktop-timer/desktop-timer.component';
import { MobileTaskDetailsDialogComponent } from 'src/app/components/mobile/mobile-task-details-dialog/mobile-task-details-dialog.component';
import { ProjectEntity } from 'src/core/store/projects/projects.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-mobile-timer',
  templateUrl: './mobile-timer.component.html',
  styleUrls: ['./mobile-timer.component.scss']
})
export class MobileTimerComponent extends DesktopTimerComponent {

  selectedProject: ProjectEntity;

  constructor(
    protected projectsFacade: ProjectsFacade,
    protected tasksFacade: TasksFacade,
    protected timeStore: TimeStore,
    protected cd: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    super(
      projectsFacade,
      tasksFacade,
      timeStore,
      cd,
    );
  }

  ngOnInit() {
    super.ngOnInit();

    this.projectsFacade.selectedProject$
      .pipe(takeUntil(this.uns$))
      .subscribe(project => this.selectedProject = project);
  }

  detailsTask() {
    this.dialog.open(MobileTaskDetailsDialogComponent, {
      width: '90vw',
      maxWidth: '90vw',
      data: this.task
    });
  }

}
