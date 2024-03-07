import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { Sprint, User } from 'src/core/store/projects/projects.model';
import TasksFiltersManager from '../../abstract/tasksFiltersManager';
import { FilterFields, Filters } from '../../desktop/desktop-tasks/desktop-tasks.component';
import { MobileTasksFiltersService, SortOption } from './mobile-tasks-filters.service';


type Fields = keyof FilterFields | 'sort';

@Component({
  selector: 'app-mobile-tasks-filter',
  templateUrl: './mobile-tasks-filter.component.html',
  styleUrls: ['./mobile-tasks-filter.component.scss']
})
export class MobileTasksFilterComponent extends TasksFiltersManager implements OnInit {
  private uns$ = new Subject<void>();

  sortOptions: SortOption[] = [
    { name: 'tt.tasks.name', column: 'title_number', direction: 'asc' },
    { name: 'tt.tasks.name', column: 'title_number', direction: 'desc' },
  ];

  sortSettings = this.mobileTasksFiltersService.sortSettings;
  filters = this.mobileTasksFiltersService.filters;

  allSprints: Sprint[];
  sprints: Sprint[];
  users: User[];
  allUsers: User[];

  constructor(
    private mobileTasksFiltersService: MobileTasksFiltersService,
    private projectsFacade: ProjectsFacade,
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('MobileTasksFilterComponent', this.sortSettings, this.filters);

    this.setSprintsAutoFetch();
    this.subscribeSprints();

    this.setUsersAutoFetch();
    this.subscribeUsers();

    this.mobileTasksFiltersService.tasksChange
      .pipe(takeUntil(this.uns$))
      .subscribe(() => this.reset());
  }

  private setSprintsAutoFetch() {
    this.projectsFacade.sprintsEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.projectsFacade.fetchSprints());
  }

  private subscribeSprints() {
    this.projectsFacade.sprints$
      .pipe(takeUntil(this.uns$))
      .subscribe(sprints => {
        this.allSprints = sprints;
        this.sprints = sprints ? sprints.slice() : sprints;
      });
  }

  private setUsersAutoFetch() {
    this.projectsFacade.usersEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.projectsFacade.fetchUsers());
  }

  private subscribeUsers() {
    this.projectsFacade.users$
      .pipe(takeUntil(this.uns$))
      .subscribe(users => {
        this.allUsers = users;
        this.users = users ? users.slice() : users;
      });
  }

  private reset() {
    this.filters = new Filters();
    this.sortSettings = new SortOption();
  }

  filter() {
    this.mobileTasksFiltersService.filtersChange.next(this.filters);
    console.log('MobileTasksFilterComponent > filters', this.filters);
  }

  sort() {
    this.mobileTasksFiltersService.sortChange.next(this.sortSettings);
    console.log('MobileTasksFilterComponent > sort', this.sortSettings);
  }

  compareSortSettings(option: SortOption, value: SortOption) {
    return option.direction === value.direction;
  }

  clear(field: Fields) {
    if (field === 'sort') {
      this.sortSettings = new SortOption();
      this.sort();
    } else {
      // @ts-ignore
      this.filters[field] = null;
      this.filter();
    }
  }

}
