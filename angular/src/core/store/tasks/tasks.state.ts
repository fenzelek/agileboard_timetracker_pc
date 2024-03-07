import { TaskAutoAssignMeMap, TaskEntitiesMap, TaskStatusesMap } from './tasks.model';

export interface TasksState {
  map: TaskEntitiesMap;
  loading: boolean;
  detailsLoading: boolean;
  selected: {
    projectId: number;
    taskId: number;
  };
  active: {
    projectId: number;
    taskId: number;
  };
  prevActive: {
    projectId: number;
    taskId: number;
  };
  statuses: TaskStatusesMap;
  autoAssignMe: TaskAutoAssignMeMap;
}
