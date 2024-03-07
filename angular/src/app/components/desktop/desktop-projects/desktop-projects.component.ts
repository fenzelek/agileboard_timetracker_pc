import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { ProjectEntity } from 'src/core/store/projects/projects.model';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { ElectronService, ViewMode } from 'src/electronService/electron.service';

interface ProjectsTimes {
  [projectId: number]: Time;
}


@Component({
  selector: 'app-desktop-projects',
  templateUrl: './desktop-projects.component.html',
  styleUrls: ['./desktop-projects.component.scss']
})
export class DesktopProjectsComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();
  private projectsChanged$ = new Subject<void>();

  loading = false;
  projects: ProjectEntity[] = [];

  times: ProjectsTimes = {};

  constructor(
    protected projectFacade: ProjectsFacade,
    protected timeStore: TimeStore,
    protected cd: ChangeDetectorRef,
    protected electronService: ElectronService
  ) { 
    // this.cd.detach();
  }

  ngOnInit(): void {
    this.subscribeLoading();
    this.subscribeProjects();
    this.setProjectsAutoFetch();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    this.projectsChanged$.next();
    this.projectsChanged$.complete();
  }

  private subscribeLoading() {
    this.projectFacade.loadingProjects$
      .pipe(takeUntil(this.uns$))
      .subscribe(loading => {
        this.loading = loading;
        this.cd.detectChanges();
      });
  }

  private subscribeProjects() {
    this.projectFacade.entities$
      .pipe(takeUntil(this.uns$))
      .subscribe(value => {
        this.projects = value;

        this.projectsChanged$.next();
        this.projectsChanged$.complete();
        this.projectsChanged$ = new Subject<void>();

        this.subscribeTimes();
        this.cd.detectChanges();
      });
  }

  private subscribeTimes() {
    this.projects.forEach(project => {
      this.timeStore.projects.onChange(project.timeStoreKey)
        .pipe(takeUntil(this.uns$), takeUntil(this.projectsChanged$))
        .subscribe(time => {
          this.times[project.data.id] = time;
          this.cd.detectChanges();
        });
    });
  }


  private setProjectsAutoFetch() {
    this.projectFacade.entitiesEmpty$
      .pipe(takeUntil(this.uns$), filter(v => v))
      .subscribe(() => this.projectFacade.fetchProjects());
  }

  // actions

  selectProject(id: number) {
    this.projectFacade.setSelected(id);

    if (this.electronService.currentViewMode === ViewMode.COMPACT) {
      this.electronService.changeViewMode(this.electronService.defaultViewMode);
    }
  }

}
