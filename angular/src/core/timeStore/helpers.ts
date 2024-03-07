import { Observable, timer } from "rxjs";
import { mapTo } from "rxjs/operators";
import { SyncData_fromServer, SyncData_toSend, Time, TimeFrame } from "./model";


export function parseTime(timeInSeconds: number): Time {
  const time = new Time();

  const hours = Math.floor(timeInSeconds / 3600);
  const secondsOfHours = hours * 3600;

  const minutes = Math.floor((timeInSeconds - secondsOfHours) / 60);
  const secondsOfMinutes = minutes * 60;

  const seconds = timeInSeconds - secondsOfHours - secondsOfMinutes;

  time.set(hours, minutes, seconds);
  return time;
}

export function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param iteration 0 - based
 */
type IterationHandler = (iteration?: number) => any;
export function repeat(times: number, fn: IterationHandler) {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
}

export function saveFramesMock(data: SyncData_toSend): Observable<{ data: SyncData_fromServer }> {
  const resp: SyncData_fromServer = {
    companies: {},
    projects: {},
    tickets: {},
    reject_frames: [],
    totalTime: 300,  // set to 0:05:00
  };

  let toModify = 1;

  data.frames.forEach(item => {
    if (!toModify) return;

    resp.tickets[`${item.companyId}:${item.projectId}:${item.taskId}`] = 65; // set to 0:01:05
    resp.projects[`${item.companyId}:${item.projectId}`] = 200; // set to 0:03:20
    resp.companies[`${item.companyId}`] = 250; // set to 0:04:10
    
    toModify --;
  });

  return timer(2000).pipe(mapTo({ data: resp }));
}
