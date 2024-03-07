import { environment } from "src/environments/environment";

export class TimeFrameBase {
  companyId: number;
  projectId: number;
  taskId: number;
  projectName: string;
  taskName: string;
}

export class TimeFrame extends TimeFrameBase {
  from: number; // timestamp in seconds
  to: number; // timestamp in seconds
  screens?: string[]; // screenshotId[]
  activity = 100;
  idle: boolean;

  constructor(base: TimeFrameBase) {
    super();
    this.companyId = base.companyId;
    this.projectId = base.projectId;
    this.projectName = base.projectName;
    this.taskName = base.taskName;
    this.taskId = base.taskId;
    if (environment.electron) {
      this.screens = [];
    }
  }

  start() {
    this.from = Math.floor(Date.now() / 1000);
  }
  stop() {
    this.to = Math.floor(Date.now() / 1000);
  }
}

export class Time {
  hours = 0;
  minutes = 0;
  seconds = 0;

  set(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  increment() {
    this.seconds++;
  
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
  
      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours++;
      }
    }
  
    return this;
  }
}

export interface SyncData_fromServer {
  companies: SyncDataItem;
  projects: SyncDataItem;
  tickets: SyncDataItem;
  reject_frames: TimeFrame[];
  totalTime?: number;
}

export interface SyncData_toSend {
  frames: TimeFrame[];
}

export interface SyncDataItem {
  [key: string]: number;
}

export type EntryName = 'companies' | 'projects' | 'tasks';

export interface ScreensMap {
  // @ts-ignore
  [key: string]: Buffer;
}

export interface Screen {
  // @ts-ignore
  buffer: Buffer | null;
  id: string;
}
