import { ProjectStatus, Sprint, User } from 'src/core/store/projects/projects.model';
import { Filters } from '../desktop/desktop-tasks/desktop-tasks.component';


export default class TasksFiltersManager {
  allStatuses: ProjectStatus[];
  statuses: ProjectStatus[];
  allSprints: Sprint[];
  sprints: Sprint[];
  users: User[];
  allUsers: User[];

  filters: Filters;

  lastFilterQuery: { [index: string]: string } = {
    sprints: null,
    users: null,
    statuses: null
  };

  filterOptions(query: string, filterName: 'statuses' | 'sprints' | 'users') {
    query = query.toLowerCase();
    this.lastFilterQuery[filterName] = query;

    if (!query)
      this.restoreAllAptions(filterName);
    else {
      if (filterName === 'sprints')
        this.sprints = this.allSprints.filter(sprint => sprint.name.toLowerCase().includes(query));
      if (filterName === 'statuses') 
        this.statuses = this.allStatuses.filter(status => status.name.toLowerCase().includes(query))
      else
        this.users = this.allUsers.filter(user => user.user.data.fullName.toLowerCase().includes(query));
    }
  }

  restoreAllAptions(filterName: 'statuses' |  'sprints' | 'users') {
    if (filterName === 'sprints') {
      this[filterName] = this.allSprints.slice();
    } else if(filterName === 'statuses') {
      this[filterName] = this.allStatuses.slice();
    } else {
      this[filterName] = this.allUsers.slice();
    }
  }

  getStatusFilterValueLabel(): string {
    if (!this.allStatuses) return '';
    const selected = this.allStatuses.find(status => status.id === this.filters.status);
    return selected ? selected.name : '';
  }

  getSprintFilterValueLabel(): string {
    if (!this.allSprints) return '';
    const selected = this.allSprints.find(sprint => sprint.id === this.filters.sprint);
    return selected ? selected.name : '';
  }

  getAssignedFilterValueLabel(): string {
    if (!this.allUsers) return '';
    const selected = this.allUsers.find(user => user.user_id === this.filters.assigned);
    return selected ? selected.user.data.fullName : '';
  }
}
