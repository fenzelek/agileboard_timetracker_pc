import { Injectable } from "@angular/core";
import { ProjectsFacade } from "src/core/store/projects/projects.facade";
import { CompaniesFacade } from "src/core/store/companies/companies.facade";
import { TasksFacade } from "src/core/store/tasks/tasks.facade";
import { TimeStore } from "src/core/timeStore/timeStore";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private projectsFacade: ProjectsFacade,
    private companiesFacade: CompaniesFacade,
    private tasksFacade: TasksFacade,
    private timeStore: TimeStore,
  ) { }

  reloadData() {
    if (this.timeStore.isOffline) {
      return;
    }

    if (this.companiesFacade.selectedCompany) {
      this.projectsFacade.fetchProjects();

      if (this.projectsFacade.selectedProject) {
        this.tasksFacade.fetchTasks();
      }
    }
  }

}