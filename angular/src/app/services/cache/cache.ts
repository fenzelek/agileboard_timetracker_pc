import { Company } from "src/core/store/companies/companies.model";
import { Project, Sprint, User } from "src/core/store/projects/projects.model";
import { Task, TaskDetails } from "src/core/store/tasks/tasks.model";
import { set, setMany, get, clear, createStore, UseStore } from 'idb-keyval';
import { from, Observable } from "rxjs";
import Deferred, { allSettled } from "src/shared/deferred";
import { mapTo } from "rxjs/operators";

const LS_KEY = 'tt-CACHE';
const DB_NAME = 'tt-cache';
const DB_STORE_NAME = 'cache';

type DataProps = 'companies' | 'projects' | 'tasks' | 'tasksDetails' | 'sprints' | 'users';

export interface StorageUsageInfo {
  quota: number;
  usage: number;
  usageDetails: {
    indexedDB: number;
  };
}

export class Cache {
  private store: UseStore;
  private ready = new Deferred<void>();

  private companies: Company[] = [];

  // key = companyId
  private projects: { [key: string]: Project[] } = {};

  // key = companyId:projectId
  private tasks: { [key: string]: Task[] } = {};

  // key = companyId:projectId:taskId
  private tasksDetails: { [key: string]: TaskDetails } = {};

  // key = companyId:projectId
  private sprints: { [key: string]: Sprint[] } = {};

  // key = companyId:projectId
  private users: { [key: string]: User[] } = {};


  constructor() {
    // cleanup previous implementation
    localStorage.removeItem(LS_KEY);
  }

  init(userId: number): Observable<void> {
    console.log('[Cache] init..');
    this.store = createStore(`${DB_NAME}-${userId}`, DB_STORE_NAME);

    // fetch data from DB
    allSettled(
      this.getFromDB('companies').then(companies => companies && (this.companies = JSON.parse(companies))),
      this.getFromDB('projects').then(projects => projects && (this.projects = JSON.parse(projects))),
      this.getFromDB('tasks').then(tasks => tasks && (this.tasks = JSON.parse(tasks))),
      this.getFromDB('tasksDetails').then(tasksDetails => tasksDetails && (this.tasksDetails = JSON.parse(tasksDetails))),
      this.getFromDB('sprints').then(sprints => sprints && (this.sprints = JSON.parse(sprints))),
      this.getFromDB('users').then(users => users && (this.users = JSON.parse(users))),
    ).then(() => {
      this.ready.resolve();
      console.log('[Cache] ready');
    });

    return from(this.ready.promise);
  }

  reset(): void {
    this.ready = new Deferred<void>();
    this.companies = [];
    this.projects = {};
    this.tasks = {};
    this.tasksDetails = {};
    this.sprints = {};
    this.users = {};
  }

  private getFromDB(key: string): Promise<any> {
    return get(key, this.store);
  }

  private setToDB(key: DataProps): void {
    const value = JSON.stringify(this[key]);
    set(key, value, this.store);
  }


  /* getters */

  getCompanies(): Observable<Company[]> {
    return from(this.ready.promise.then(() => this.companies));
  }

  getProjects(companyId: number): Observable<Project[]> {
    return from(this.ready.promise.then(() => this.projects[companyId] || []));
  }

  getTasks(companyId: number, projectId: number): Observable<Task[]> {
    return from(this.ready.promise.then(() => this.tasks[`${companyId}:${projectId}`] || []));
  }

  getTaskDetails(companyId: number, projectId: number, taskId: number): Observable<TaskDetails> {
    return from(this.ready.promise.then(() => this.tasksDetails[`${companyId}:${projectId}:${taskId}`]));
  }

  getSprints(companyId: number, projectId: number): Observable<Sprint[]> {
    return from(this.ready.promise.then(() => this.sprints[`${companyId}:${projectId}`] || []));
  }

  getUsers(companyId: number, projectId: number): Observable<User[]> {
    return from(this.ready.promise.then(() => this.users[`${companyId}:${projectId}`] || []));
  }

  /* setters */

  setCompanies(companies: Company[]): void {
    this.ready.promise.then(() => {
      this.companies = companies;
      this.setToDB('companies');
    });
  }

  setProjects(companyId: number, projects: Project[]): void {
    this.ready.promise.then(() => {
      this.projects[companyId] = projects;
      this.setToDB('projects');
    });
  }

  setTasks(companyId: number, projectId: number, tasks: Task[]): void {
    this.ready.promise.then(() => {
      this.tasks[`${companyId}:${projectId}`] = tasks;
      this.setToDB('tasks');
    });
  }

  setTaskDetails(companyId: number, projectId: number, taskId: number, details: TaskDetails): void {
    this.ready.promise.then(() => {
      this.tasksDetails[`${companyId}:${projectId}:${taskId}`] = details;
      this.setToDB('tasksDetails');
    });
  }

  setSprints(companyId: number, projectId: number, sprints: Sprint[]): void {
    this.ready.promise.then(() => {
      this.sprints[`${companyId}:${projectId}`] = sprints;
      this.setToDB('sprints');
    });
  }

  setUsers(companyId: number, projectId: number, users: User[]): void {
    this.ready.promise.then(() => {
      this.users[`${companyId}:${projectId}`] = users;
      this.setToDB('users');
    });
  }

  /* dispose */

  clear(): Observable<void> {
    this.companies = [];
    this.projects = {};
    this.tasks = {};
    this.tasksDetails = {};
    this.sprints = {};
    this.users = {};

    const promise = clear(this.store);
    return from(promise);
  }

  getStorageUsageInfo(): Observable<StorageUsageInfo> {
    return new Observable(sub => {
      // Chrome 75 and later
      navigator.storage.estimate().then((result: any) => {
        const storageUsageInfo: StorageUsageInfo = result;
        sub.next(storageUsageInfo);
        sub.complete();
      });
    });
  }

}
