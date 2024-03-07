import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Filters, Sort } from "../../desktop/desktop-tasks/desktop-tasks.component";


export class SortOption extends Sort {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MobileTasksFiltersService {

  sortSettings = new SortOption();
  filters = new Filters();

  filtersChange = new Subject<Filters>();
  sortChange = new Subject<SortOption>();
  tasksChange = new Subject<void>();

  constructor() {
    this.filtersChange.subscribe(value => this.filters = value);
    this.sortChange.subscribe(value => this.sortSettings = value);
  }

}
