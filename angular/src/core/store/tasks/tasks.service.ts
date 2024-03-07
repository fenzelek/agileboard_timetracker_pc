import { Injectable } from '@angular/core';
import { ProjectStatus, Sprint } from '../projects/projects.model';
import { Task } from './tasks.model';


@Injectable()
export class TasksService {
  constructor() {}

  parseTasks(tasks: Task[],  companyId: number) {
    return tasks.map(task => {
      task = { ...task };
  
      const assignedUser = task.assigned_user.data;
      task.assigned = assignedUser ? `${assignedUser.first_name} ${assignedUser.last_name}` : '-';
  
      task.title_number = parseInt(task.title.split('-')[1]);
      task.company_id = companyId;
  
      return task;
    });
  }

  parseProjectStatusArrayToTasks(statusArray: ProjectStatus[]): Task[] {
    const cloneStatusArray: ProjectStatus[] = JSON.parse(JSON.stringify(statusArray));
    let allTasks: Task[] = [];

    cloneStatusArray.forEach((status) => {
      let statusTasks = status.tickets.data;
      delete status.tickets;

      statusTasks = statusTasks.map((task) => ({ ...task, status }));

      allTasks = allTasks.concat(statusTasks);
    });

    return allTasks;
  }

  findStatusById(statuses: ProjectStatus[], status_id: number) {    
    return statuses ? statuses.find((status) => status.id === status_id) : null;
  }

  findSprintById(sprints: Sprint[], sprint_id: number) {
    return sprints ? sprints.find((sprint) => sprint.id === sprint_id) : null
  }

}
