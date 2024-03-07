import { BehaviorSubject, Observable } from "rxjs";
import { parseTime } from "./helpers";
import { SyncDataItem, Time } from "./model";


export class TimeEntry {

  private subjects = new Map<string, BehaviorSubject<Time>>();
  map = new Map<string, Time>();

  _increment(key: string): void {
    if (!this.map.has(key))
      this.map.set(key, new Time());

    const newVal = this.map.get(key).increment();

    if (this.subjects.has(key))
      this.subjects.get(key).next(newVal);
  }

  _sync(syncData: SyncDataItem) {
    // clear values that are not provided by api
    this.map.forEach((time, key) => {
      if (syncData[key]) return;

      time.set(0, 0, 0);

      if (this.subjects.has(key))
        this.subjects.get(key).next(time);
    });

    // set values by api data
    Object.keys(syncData).forEach(key => {
      const timeInSec = syncData[key];
      const time = parseTime(timeInSec);

      this.map.set(key, time);

      if (this.subjects.has(key))
        this.subjects.get(key).next(time);
    });
  }

  onChange(key: string): Observable<Time> {
    if (!this.subjects.has(key)) {
      const subject = new BehaviorSubject(this.map.get(key) || new Time());
      this.subjects.set(key, subject);
    }

    return this.subjects.get(key).asObservable();
  }

  removeListener(key: string) {
    this.subjects.get(key).complete();
    this.subjects.delete(key);
  }

  removeAllListeners() {
    this.subjects.forEach(sub => sub.complete());
    this.subjects.clear();
  }

}
