import {Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filters } from 'src/app/components/desktop/desktop-tasks/desktop-tasks.component';
import { MobileCreateTaskComponent } from 'src/app/components/mobile/mobile-create-task/mobile-create-task.component';
import { MobileTasksFilterComponent } from 'src/app/components/mobile/mobile-tasks-filter/mobile-tasks-filter.component';
import { MobileTasksFiltersService, SortOption } from 'src/app/components/mobile/mobile-tasks-filter/mobile-tasks-filters.service';


@Component({
  selector: 'app-mobile-tasks',
  templateUrl: './mobile-tasks.component.html',
  styleUrls: ['./mobile-tasks.component.scss']
})
export class MobileTasksComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();
  private refs: MatDialogRef<any>[] = [];

  @Output() goNextStep: EventEmitter<void> = new EventEmitter<void>();

  isExpandFilter: boolean = false;
  isExpandTasks: boolean = true;
  isExpandCreateTask: boolean = false;

  constructor(
    private dialog: MatDialog,
    private mobileTasksFiltersService: MobileTasksFiltersService,
  ) { }

  ngOnInit(): void {
    this.mobileTasksFiltersService.filters = new Filters();
    this.mobileTasksFiltersService.sortSettings = new SortOption();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    this.refs.forEach(ref => ref.close());
  }

  openFiltersDialog() {
    const ref = this.dialog.open(MobileTasksFilterComponent, {
      width: '90vw',
      maxWidth: '90vw',
    });

    this.refs.push(ref);
  }

  openCreateTaskDialog() {
    const ref = this.dialog.open(MobileCreateTaskComponent, {
      width: '90vw',
      maxWidth: '90vw',
    });

    ref.componentInstance.clickSelected.asObservable()
      .pipe(takeUntil(this.uns$))
      .subscribe(() => {
        this.goNextStep.emit();
      });

    this.refs.push(ref);
  }

}
