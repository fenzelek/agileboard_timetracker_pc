import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, concat, interval, Observable, of, Subject, timer } from 'rxjs';
import { catchError, filter, share, takeUntil, tap } from 'rxjs/operators';
import { ElectronService } from 'src/electronService/electron.service';
import { environment } from 'src/environments/environment';
import Deferred from 'src/shared/deferred';
import { AuthFacade } from '../auth/auth.facade';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { NotificationService } from '../notifications/notification.service';
import { parseTime, randomNumberBetween, repeat, saveFramesMock } from './helpers';
import { Screen, ScreensMap, SyncData_fromServer, SyncData_toSend, Time, TimeFrame, TimeFrameBase } from './model';
import { TimeEntry } from './timeEntry';

const IS_OFFLINE_LS_KEY = 'IS_OFFLINE';

@Injectable()
export class TimeStore {
  private stopTimers$ = new Subject<void>();

  // total time
  private totalTimeChangeSub = new BehaviorSubject<Time>(new Time());
  totalTime = new Time();

  // synchronization
  private synchronizingSub = new BehaviorSubject<boolean>(false);
  private synchronizedSub = new BehaviorSubject<boolean>(this.getIsSynchronized());

  // last sync
  private lastSyncSub = new BehaviorSubject<number>(null);
  /**
   * @description timestamp Date.now()
   */
  lastSync: number = null;

  // offline
  private offlineSub = new BehaviorSubject<boolean>(this.getIsOffline());
  isOffline = this.getIsOffline();

  // idle
  isIdle = false;
  private idleTimeSub = new BehaviorSubject<number>(0);
  private idleTime = 0;

  // frame
  private currentFrame: TimeFrame;
  private lastFrameBase: TimeFrameBase;

  private userId: number;

  // time data
  companies = new TimeEntry();
  projects = new TimeEntry();
  tasks = new TimeEntry();

  /**
   * @description Timer is running
   */
  isActive = false;
  private isActiveSub = new BehaviorSubject<boolean>(false);
  
  get totalTimeChange$ () { return this.totalTimeChangeSub.asObservable() }
  get synchronizing$ () { return this.synchronizingSub.asObservable() }
  get lastSync$ () { return this.lastSyncSub.asObservable() }
  get isOffline$ () { return this.offlineSub.asObservable() }
  get isSynchronized$ () { return this.synchronizedSub.asObservable() }
  get idleTime$ () { return this.idleTimeSub.asObservable() }
  get isActive$ () { return this.isActiveSub.asObservable() }


  constructor(
    private ls: LocalStorageService,
    private http: HttpClient,
    private electronService: ElectronService,
    private authFacade: AuthFacade,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
  ) {
    if (environment.electron) {
      this.subscribeIdle();
    }

    this.subscribeUser();
  }

  reset() {
    this.setTotalTime(0);
    this.setIsActive(false);
    this.setOffline(this.getIsOffline());

    this.synchronizingSub.next(false);
    this.refreshIsSynchronized();
    this.lastSyncSub.next(this.lastSync);
    
    this.currentFrame = null;
    this.lastFrameBase = null;
    
    this.companies = new TimeEntry();
    this.projects = new TimeEntry();
    this.tasks = new TimeEntry();
  }

  start(frameBase: TimeFrameBase): void {
    // if other task is already running, stop it first
    if (this.isActive) {
      this.stop(() => this.start(frameBase));
      return;
    }

    this.setIsActive(true);

    this.lastFrameBase = frameBase;
    this.currentFrame = new TimeFrame(frameBase);

    this.currentFrame.start();

    this.activityTrackStart();

    // time frame timeout
    timer(environment.timeFrameDuration)
      .pipe(takeUntil(this.stopTimers$))
      .subscribe(() => {
        this.nextFrame();
      });

    // timer for incrementing time: total, company, project, task
    interval(1000)
      .pipe(takeUntil(this.stopTimers$))
      .subscribe(() => {
        this.incrementIdleTime();
        this.incrementTotalTime();
        this.companies._increment(`${frameBase.companyId}`);
        this.projects._increment(`${frameBase.companyId}:${frameBase.projectId}`);
        this.tasks._increment(`${frameBase.companyId}:${frameBase.projectId}:${frameBase.taskId}`);
      });

    // screens
    if (environment.electron) {
      this.setTakingScreens();
    }
  }

  stop(onStopped = () => {}): void {
    if (!this.isActive) {
      onStopped();
      return;
    };

    this.setIsActive(false);

    this.getActivity().then(activity => {
      this.currentFrame.activity = activity;
      this.currentFrame.idle = this.isIdle;
      this.currentFrame.stop();
      this.saveCurrentFrame(this.isIdle);
  
      this.activityTrackStop();
  
      this.stopTimers$.next();
      this.stopTimers$.complete();
      this.stopTimers$ = new Subject<void>();

      if (this.isIdle) {
        onStopped();
        return;
      }
  
      if (this.isOffline)
        this.synchronizedSub.next(false);
      else
        this.sync();

      onStopped();
    });
  }

  /**
   * @description Sync times with server
   */
  sync(cb = () => {}) {
    this.synchronizingSub.next(true);

    const frames = this.getFrames();

    frames.forEach((frame) => {
      delete frame.projectName;
      delete frame.taskName;
    })

    const framesSyncData: SyncData_toSend = { frames };

    console.log('sync', frames);

    const syncFrames = this.syncFrames(framesSyncData);
    let syncScreens: Observable<any>;

    if (environment.electron) {
      syncScreens = this.syncScreens(frames);
    } else {
      syncScreens = of(null);
    }

    syncFrames.subscribe(() => {
      console.log('frames synced');
      syncScreens.subscribe(() => {  // no possible error here, errors handled inside
        this.setLastSync();
        this.synchronizingSub.next(false);
        this.synchronizedSub.next(true);
        if (environment.electron) console.log('screens synced');
        cb();
      });
    }, error => {
      this.synchronizingSub.next(false);
      this.synchronizedSub.next(false);
      console.warn('sync error', this);
      cb();
    });
  }

  /**
   * @description Fetch times from server
   */
  fetch() {
    this.http.get<{ data: SyncData_fromServer }>('time-tracker/time-summary').subscribe(resp => {
      this.companies._sync(resp.data.companies);
      this.projects._sync(resp.data.projects);
      this.tasks._sync(resp.data.tickets);

      let totalTime = 0;
      Object.keys(resp.data.companies).forEach(key => totalTime += resp.data.companies[key]);
      this.setTotalTime(totalTime);
      
      this.setLastSync();

      console.log('fetched');
    });
  }

  setOffline(val: boolean) {
    this.isOffline = val;
    this.ls.setItem(IS_OFFLINE_LS_KEY, val);
    this.offlineSub.next(val);
  }

  // idle time
  keepIdleTime() {
    const frames = this.getFrames();
    const idleFrames = this.getIdleFrames();
    const allFrames = frames.concat(idleFrames);
    this.ls.setItem(this.getFramesLsKey(), allFrames);
    this.rejectIdleTime();

    if (this.isOffline)
      this.synchronizedSub.next(false);
    else
      this.sync();
  }

  rejectIdleTime() {
    this.ls.setItem(this.getIdleFramesLsKey(), null);
    this.clearIdleTime();
  }

  getIsSynchronized() {
    if (this.userId) {
      const auth = this.ls.getItem('AUTH');
      if (!auth) return true;
      const frames = this.ls.getItem(this.getFramesLsKey());
      return frames && frames.length ? false : true;
    } else {
      return true;
    }
  }

  refreshIsSynchronized(): void {
    this.synchronizedSub.next(this.getIsSynchronized());
  }

  getIsOffline() {
    return !!this.ls.getItem(IS_OFFLINE_LS_KEY);
  }

  // private

  private subscribeIdle() {
    this.electronService.onIdleStart().pipe(filter(() => this.isActive)).subscribe(() => {
      console.warn('Idle start');
      this.nextFrame(() => this.isIdle = true);
    });

    this.electronService.onIdleStop().pipe(filter(() => this.isActive)).subscribe(() => {
      console.warn('Idle stop');
      this.nextFrame(() => this.isIdle = false);
    });
  }

  private subscribeUser() {
    this.authFacade.user$.subscribe(user => {
      this.userId = user ? user.id : null;
      this.refreshIsSynchronized();
    });
  }

  private incrementTotalTime() {
    this.totalTime.increment();
    this.totalTimeChangeSub.next(this.totalTime);
  }

  private setTotalTime(time: number) {
    this.totalTime = parseTime(time);
    this.totalTimeChangeSub.next(this.totalTime);
  }

  private setIsActive(value: boolean) {
    this.isActive = value;
    this.isActiveSub.next(value);
  }

  private setLastSync() {
    const value = Date.now();
    this.lastSync = value;
    this.lastSyncSub.next(value);
  }

  private saveCurrentFrame(idle = false) {
    if (idle) {
      const idleFrames: TimeFrame[] = this.getIdleFrames();
      idleFrames.push(this.currentFrame);
      this.ls.setItem(this.getIdleFramesLsKey(), idleFrames);
    } else {
      const frames: TimeFrame[] = this.getFrames();
      frames.push(this.currentFrame);
      this.ls.setItem(this.getFramesLsKey(), frames);
    }
  }

  private getFrames(): TimeFrame[] {
    return this.ls.getItem(this.getFramesLsKey()) || [];
  }

  private getIdleFrames(): TimeFrame[] {
    return this.ls.getItem(this.getIdleFramesLsKey()) || [];
  }

  private clearFrames() {
    this.ls.setItem(this.getFramesLsKey(), null);
  }

  private getFramesLsKey() {
    return `TIME-FRAMES-${this.userId}`;
  }

  private getIdleFramesLsKey() {
    return `TIME-FRAMES-IDLE-${this.userId}`;
  }

  private getActivity(): Promise<number> {
    const def = new Deferred<number>();

    if (environment.electron) {
      this.electronService.getActivity().then(activity => {
        def.resolve(activity);
      });
    } else {
      def.resolve(environment.activityIdleValue);
    }

    return def.promise;
  }

  private activityTrackStart() {
    if (!environment.electron) return;
    this.electronService.activityTrackStart();
  }

  private activityTrackStop() {
    if (!environment.electron) return;
    this.electronService.activityTrackStop();
  }

  private nextFrame(cb = () => {}) {
    this.stop(() => {
      this.start(this.lastFrameBase);
      cb();
    });
  }

  private clearIdleTime() {
    this.idleTime = 0;
    this.idleTimeSub.next(this.idleTime);
  }

  private incrementIdleTime() {
    if (!this.isIdle) return;

    this.idleTime ++;
    this.idleTimeSub.next(this.idleTime);
    console.log('idleTime', parseTime(this.idleTime));
  }

  private setTakingScreens() {
    repeat(environment.screensPerFrame, () => {
      const timeout = randomNumberBetween(0, environment.timeFrameDuration - 3000); // leave 3 sec margin before frame end (making screens is asynchronous)

      timer(timeout)
        .pipe(takeUntil(this.stopTimers$))
        .subscribe(() => {
          const timeStamp = Date.now();

          this.electronService.takeScreen().then(buffers => {
            const screens: Screen[] = [];

            buffers.forEach((buffer, index) => {
              const screenshotId = this.createScreenshotId(this.userId, timeStamp, index);
              this.currentFrame.screens.push(screenshotId);
              screens.push({ buffer, id: screenshotId });
            });

            this.handleScreens(screens, this.currentFrame);
          }, err => {
            console.error(err);
          });
        });
    });
  }

  private createScreenshotId(userId: number, timeStamp: number, index: number) {
    return `${userId}_${timeStamp}_${index}.png`;
  }

  private handleScreens(screens: Screen[], frame: TimeFrame) {
    console.log('handleScreens', screens, frame);

    if (this.isOffline) {
      this.saveScreensLocally(screens);
    } else {
      this.sendScreensToServer(screens, frame).subscribe();
    }
  }

  private saveScreensLocally(screens: Screen[]): void {
    const screensMap: ScreensMap = {};

    screens.forEach(screen => {
      screensMap[screen.id] = screen.buffer;
    });

    this.electronService.saveScreen(screensMap);
  }

  /**
   * @description Create requests for frame screens. After request completes, remove file from fs.
   */
  private sendScreensToServer(screens: Screen[], frame: TimeFrame): Observable<any> {
    return new Observable(subscriber => {

      if (!screens.length) {
        subscriber.next();
        subscriber.complete();
        return;
      }

      const url = `time-tracker/add-screenshots`;
      const requests: Observable<any>[] = [];
      
      screens.forEach(screen => {
        const fd = new FormData();
        const blob = new Blob([screen.buffer], { type: 'image/png' });
        const file = new File([blob], screen.id, { type: 'image/png' });

        fd.set('screen', file);
        fd.set('screen_id', screen.id);
        fd.set('project_id', frame.projectId.toString());

        const req = this.http.post(url, fd).pipe(
          catchError((err) => of(err)),
          tap(() => this.electronService.removeScreen(screen.id)),
        );
        requests.push(req);
      });

      const sequence = concat(...requests);
      let reqCounter = 0;

      sequence.subscribe(() => {
        reqCounter ++;

        if (reqCounter === requests.length) {
          subscriber.next();
          subscriber.complete();
        }
      });

    });
  }

  private syncFrames(data: SyncData_toSend) {
    // return saveFramesMock(data).pipe(
    return this.http.post<{ data: SyncData_fromServer }>('time-tracker/add-frames', data).pipe(
      share(),
      tap(resp => this.syncTime(resp.data)),
      tap(resp => this.showRejectedFramesNotification(resp.data)),
    );
  }

  private syncTime(data: SyncData_fromServer) {
    // update local data by server response
    this.companies._sync(data.companies);
    this.projects._sync(data.projects);
    this.tasks._sync(data.tickets);

    // sum time
    let totalTime = 0;
    Object.keys(data.companies).forEach(key => totalTime += data.companies[key]);
    this.setTotalTime(totalTime);

    this.clearFrames();
  }

  private showRejectedFramesNotification(data: SyncData_fromServer) {
    const rejectedFrames = data.reject_frames;

    if (!rejectedFrames.length) return;

    let msg = `<div>${this.translateService.instant('tt.warnings.rejected-frames')}:</div><br>`;

    rejectedFrames.forEach(frame => {
      const from = this.datePipe.transform(new Date(frame.from * 1000), 'd/M/yy, hh:mm:ss');
      const to = this.datePipe.transform(new Date(frame.to * 1000), 'd/M/yy, hh:mm:ss');
      msg += `<div>${from} - ${to}</div><br>`;
    });

    this.notificationService.toaster('warning', msg, 0);
  }

  private syncScreens(frames: TimeFrame[]): Observable<any> {
    return new Observable(subscriber => {

      const screensPromises: Promise<Screen[]>[] = [];
      const framesScreensSyncs: Observable<any>[] = [];

      frames.forEach(frame => {
        // fetch frame screens from hdd
        const screensPromise = this.electronService.getScreensFiles(frame.screens);
        screensPromises.push(screensPromise);

        screensPromise.then(screens => {
          console.log('syncScreens', frame, screens);
          screens = screens.filter(el => el.buffer !== null); // null = file already synchronized or fetch error
          // create observable of requests which send frame screens; it catches error, so will always emit
          const obs = this.sendScreensToServer(screens, frame);
          framesScreensSyncs.push(obs);
        });
      });

      // when all screens of all frames are fetched from hdd
      Promise.all(screensPromises).then(() => {
        // schedule http requests
        const sequence = concat(...framesScreensSyncs);
        let syncsCounter = 0;

        // execute observables; this will send requests with screens in sequence - one after another
        sequence.subscribe(() => {
          syncsCounter ++;

          // all requests completed
          if (syncsCounter === framesScreensSyncs.length) {
            subscriber.next();
            subscriber.complete();
          }
        });
      });

    });
  }

}
