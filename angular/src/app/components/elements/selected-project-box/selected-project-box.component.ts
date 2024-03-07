import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { ProjectEntity } from 'src/core/store/projects/projects.model';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';

@Component({
  selector: 'app-selected-project-box',
  templateUrl: './selected-project-box.component.html',
  styleUrls: ['./selected-project-box.component.scss']
})
export class SelectedProjectBoxComponent implements OnInit {
  uns$ = new Subject<void>();

  project: ProjectEntity;
  projectTime: Time;

  @Input() showIcon = false;

  constructor(
    private timeStore: TimeStore,
    private projectsFacade: ProjectsFacade,
  ) { }

  ngOnInit(): void {
    this.subscribeProject();
  }

  private subscribeProject() {
    this.projectsFacade.selectedProject$
      .pipe(takeUntil(this.uns$))
      .subscribe(project => {
        this.project = project;
        this.subscribeTime();
      });
  }

  private subscribeTime() {
    if (!this.project) return;

    const projectKey = `${this.project.data.company_id}:${this.project.data.id}`;

    this.timeStore.projects.onChange(projectKey)
      .pipe(takeUntil(this.uns$))
      .subscribe(time => this.projectTime = time);
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

}
