import { ProjectStatus, UserData } from "../projects/projects.model";

/**
 * @description key: projectId, value: task statuses array
 */
export class TaskStatusesMap extends Map<number, ProjectStatus[]> {}

/**
 * @description key: companyId:projectId, value: auto assign me boolean
 */
 export class TaskAutoAssignMeMap extends Map<string, boolean> {}

/**
 * @description key: projectId, value: task entity array
 */
export class TaskEntitiesMap extends Map<number, TaskEntity[]> {}

export interface TaskEntity {
  data: Task;
  details?: TaskDetails;
  isActive: boolean;
  isSelected: boolean;
  timeStoreKey: string;
}

export interface Task {
  title: string; // task code: project first letters - number, eg: AB-102
  title_number: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  id: number;
  project_id: number;
  company_id: number;
  sprint_id: number;
  status_id: number;
  type_id: number;
  assigned_user: {
    data?: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
  assigned: string;
  stories: {
    data: any[];
  },
  status?: ProjectStatus;
}

export interface TaskDetails {
  files: {
    data: any[];
  };
  status: {
    data: {
      name: string;
    }
  };
  comments: {
    data: any[];
  };
  time_tracking_summary: {
    data: TimeTrackingItem[];
  };
  stats: {
    data: {
      tracked_summary: number;
    }
  };
  reporting_user: {
    data: UserData;
  };
  estimate_time: number;
  description: string;
}

interface TimeTrackingItem {
  user_id: number;
  ticket_id: number;
  tracked_sum: number;
  user: {
    data: UserData;
  }
}


export interface NewTaskData {
  name: string;
  project_id: number;
  sprint_id?: number;
  description?: string;
}
