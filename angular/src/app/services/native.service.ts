import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum Platform {
  BROWSER,
  DESKTOP,
  MOBILE,
}

@Injectable({
  providedIn: 'root'
})
export class NativeService {

  private networkOnlineSubject = new Subject<boolean>();

  platform: Platform;
  networkOnline$ = this.networkOnlineSubject.asObservable();
  get networkOnline() { return window.navigator.onLine };

  constructor() {
    this.setPlatform();
    this.subscribeNetworkConnection();
  }

  private setPlatform() {
    if (environment.electron) {
      this.platform = Platform.DESKTOP;
    }

    else if (environment.cordova) {
      this.platform = Platform.MOBILE;
    }

    else {
      this.platform = Platform.BROWSER;
    }
  }

  private subscribeNetworkConnection() {
    window.addEventListener('online', () => this.networkOnlineSubject.next(true));
    window.addEventListener('offline', () => this.networkOnlineSubject.next(false));
  }


  openUrl(url: string) {
    switch (this.platform) {
      case Platform.BROWSER: window.open(url, '_blank'); break;
      case Platform.MOBILE: window.open(url, '_system'); break;
      case Platform.DESKTOP:
        // @ts-ignore
        window.require('electron').shell.openExternal(url);
    }
  }

}
