import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import DesktopDialogsService from 'src/app/services/desktop-dialogs.service';
import { DesktopNotificationService } from 'src/app/services/desktop-notifications.service';
import { NotificationService } from 'src/core/notifications/notification.service';
import { Screen, ScreensMap } from 'src/core/timeStore/model';
import Events from 'src/globalEvents';
import Deferred from 'src/shared/deferred';
import { environment } from '../environments/environment';

export enum ViewMode {
  COMPACT = 'compact',
  MEDIUM = 'medium',
  WIDE = 'wide',
}


@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  currentViewMode$ = new BehaviorSubject<ViewMode>(ViewMode.MEDIUM);
  currentViewMode: ViewMode = ViewMode.MEDIUM;

  /**
   * @description Last, non-compact view. Used to restore view from compact mode.
   */
  defaultViewMode: ViewMode.MEDIUM | ViewMode.WIDE = ViewMode.MEDIUM;

  constructor(
    private notificationService: NotificationService,
    private desktopDialogsService: DesktopDialogsService,
    private desktopNotificationService: DesktopNotificationService,
  ) {
    if (environment.electron) {
      this.listenToErrors();
      this.listenToDependencies();
      this.listenToLogs();
      this.currentViewMode$.subscribe(mode => this.currentViewMode = mode);
    }
  }

  private get electron() {
    // @ts-ignore
    return window.require('electron');
  }

  private listenToErrors(): void {
    this.electron.ipcRenderer.on('error', (event: any, message: string, err: any) => {
      this.notificationService.toaster('error', message, 0);
      console.error(message, err);
    });
  }

  private listenToLogs(): void {
    this.electron.ipcRenderer.on(Events.LOG, (event: any, log: string) => {
      console.log('[MAIN process]', log);
    });
  }

  // dependencies
  private listenToDependencies(): void {
    this.electron.ipcRenderer.once(Events.DEPENDENCIES_REQUIRED, (event: any) => {
      console.log('dependencies-required, opening dialog..');
      this.desktopDialogsService.open('deps');
    });
    
    this.electron.ipcRenderer.send(Events.DEPENDENCIES_CHECK);
  }

  installDependencies(): void {
    this.electron.ipcRenderer.send(Events.DEPENDENCIES_INSTALL);
  }

  onDependenciesInstallSuccess(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.electron.ipcRenderer.on(Events.DEPENDENCIES_INSTALL_SUCCESS, (event: any) => {
        resolve();
      });
    });
  }

  onDependenciesInstallError(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.electron.ipcRenderer.on(Events.DEPENDENCIES_INSTALL_ERROR, (event: any) => {
        resolve();
      });
    });
  }

  // screens

  /**
   * @description Makes screenshot in one or more files (depending on os). Returns array of Blobs.
   */
  // @ts-ignore
  takeScreen(): Promise<Buffer[]> {
    // @ts-ignore
    const def = new Deferred<Buffer[]>();

    this.electron.ipcRenderer.once(Events.SCREENSHOT_TAKE_ERROR, (event: any, message: string, err: any) => {
      console.error('Taking screen error', message, err);
      this.notificationService.toaster('error', message, 0);
      def.reject(err);
    });

    // @ts-ignore
    this.electron.ipcRenderer.once(Events.SCREENSHOT_TAKE_VALUE, (event: any, screenShots: Buffer[]) => {
      console.log('screenShots', screenShots);

      if (false) // todo: config.showScreenshotNotification
        this.notificationService.toaster('info', 'tt.screenshot.taken');

      def.resolve(screenShots);
    });

    this.electron.ipcRenderer.send(Events.SCREENSHOT_TAKE);

    return def.promise;
  }

  /**
   * @description Saves provided screen files on local file system.
   */
  saveScreen(map: ScreensMap): Promise<void> {
    const def = new Deferred<void>();

    this.electron.ipcRenderer.once(Events.SCREENSHOT_SAVE_SUCCESS, (event: any) => {
      def.resolve();
    });

    this.electron.ipcRenderer.once(Events.SCREENSHOT_SAVE_ERROR, (event: any, err: any) => {
      console.error('Saving screen error', err);
      def.reject(err);
    });

    this.electron.ipcRenderer.send(Events.SCREENSHOT_SAVE, map);

    return def.promise;
  }

  getScreensFiles(ids: string[]): Promise<Screen[]> {
    const def = new Deferred<Screen[]>();
    const result: Screen[] = [];
    let retreiveCount = 0;

    if (!ids.length) {
      def.resolve(result);
      return def.promise;
    }

    const handleScreen = (event: any, screen: Screen) => {
      if (!ids.includes(screen.id)) return; // different frame

      result.push(screen);
      retreiveCount ++;

      if (retreiveCount === ids.length) {
        def.resolve(result);
        this.electron.ipcRenderer.off(Events.SCREENSHOT_FILE_VALUE, handleScreen);
      }
    }

    this.electron.ipcRenderer.on(Events.SCREENSHOT_FILE_VALUE, handleScreen);

    ids.forEach(id => {
      this.electron.ipcRenderer.send(Events.SCREENSHOT_FILE, id);
    });

    return def.promise;
  }

  removeScreen(screenId: string): void {
    this.electron.ipcRenderer.send(Events.SCREENSHOT_REMOVE, screenId);
  }

  // activity
  getActivity(): Promise<number> {
    const def = new Deferred<number>();

    this.electron.ipcRenderer.once(Events.ACTIVITY_VALUE, (event: any, value: number) => {
      console.log(Events.ACTIVITY_VALUE, value);
      def.resolve(value);
    });

    this.electron.ipcRenderer.send(Events.ACTIVITY_GET);

    return def.promise;
  }

  activityTrackStart(): void {
    this.electron.ipcRenderer.send(Events.ACTIVITY_START);
  }

  activityTrackStop(): void {
    this.electron.ipcRenderer.send(Events.ACTIVITY_STOP);
  }

  onIdleStart(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.electron.ipcRenderer.on(Events.IDLE_START, () => {
        subscriber.next();
      });
    });
  }

  onIdleStop(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.electron.ipcRenderer.on(Events.IDLE_STOP, () => {
        subscriber.next();
      });
    });
  }

  // credentials

  getPassword(name: string): Observable<string> {
    return new Observable<string>(subscriber => {
      this.electron.ipcRenderer.once(Events.CREDENTIALS_VALUE, (event: any, password: string) => {
        subscriber.next(password);
        subscriber.complete();
      });
      this.electron.ipcRenderer.send(Events.CREDENTIALS_GET, name);
    });
  }

  setPassword(name: string, password: string) {
    this.electron.ipcRenderer.send(Events.CREDENTIALS_SET, name, password);
  }

  // other

  onAppClosing() {
    return new Observable(subscriber => {
      this.electron.ipcRenderer.on(Events.CLOSING, (event: any) => {
        subscriber.next();
      });
    });
  }

  closeApp() {
    this.desktopNotificationService.show('tt.notify.close', { requireInteraction: true }).subscribe();
    setTimeout(() => this.electron.ipcRenderer.send(Events.CLOSE), 500);
  }

  focusApp() {
    this.electron.ipcRenderer.send(Events.FOCUS);
  }

  logout(): void {
    this.electron.ipcRenderer.send(Events.LOGOUT);
  }

  selectCompany(): void {
    this.electron.ipcRenderer.send(Events.SELECT_COMPANY);
  }

  unselectCompany(): void {
    this.electron.ipcRenderer.send(Events.UNSELECT_COMPANY);
  }

  takePath(): string {
    const app = this.electron.remote.app;

    console.warn('path: ', app.getAppPath());
    // alert('path: ' + app.getAppPath())
    return app.getAppPath();
  }

  // view

  changeViewMode(mode: ViewMode) {
    this.electron.ipcRenderer.send(Events.CHANGE_VIEW_MODE, { mode });
    this.currentViewMode$.next(mode);

    if (mode !== ViewMode.COMPACT) {
      this.defaultViewMode = mode;
    }
  }

}
