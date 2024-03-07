import { Task } from "../tasks/tasks.model";

export interface ProjectEntity {
  data: Project;
  isSelected: boolean;
  timeStoreKey: string;
}

export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  status: string;
  locked: number; // 0 | 1 boolean
  planned_activation: string;
  planned_closing: string;
  activated_at: string;
  paused_at: string;
  resumed_at: string;
  closed_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  user_id: number;
  project_id: number;
  role_id: number;
  user: {
    data: UserData;
  }
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
  avatar: string;
  avatarUrl: string;
  role: UserRole;
  selected_user_company: UserCompanyData;
}

export interface UserCompanyData {
  data?: {
    company: {
      data: {
        id: number;
        name: string;
        vat_payer: boolean;
      }
    };
    role: {
      data: {
        id: number
        default: number;
        name: UserRole;
      }
    };
    company_id: number;
    role_id: number;
    user_id: number;
    description: string;
    title: string;
    status: number;
    skills: string;
  }
}

export enum UserRole {
  system_user = 'system_user',
  admin = 'admin',
  owner = 'owner',
  tax_office = 'tax_office',
}


export interface Project {
  id: number;
  company_id: number;
  closed_at: string;
  color: string;
  created_at: string;
  created_tickets: number;
  deleted_at: string;
  language: string;
  name: string;
  short_name: string;
  time_tracking_visible_for_clients: number;
  updated_at: string;
  sprints: Sprint[];
  users: User[];
}

export interface ProjectStatus {
  id: number;
  project_id: number;
  name: string;
  priority: number;
  created_at: string;
  updated_at: string;
  tickets?: {
    data: Task[];
  };
}