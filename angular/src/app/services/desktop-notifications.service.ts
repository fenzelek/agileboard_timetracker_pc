import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DesktopNotificationService {

  private title = 'Time Tracker';
  private icon = 'assets/128x128.png';
  
  constructor(
    private translate: TranslateService,
  ) { }

  show(content: string, options: any = {}): Observable<Notification | null> {
    const body = this.translate.instant(content);

    return this.checkPermission().pipe(map(result => {
      if (result) {
        return new Notification(this.title, { body, icon: this.icon, ...options });
      } else {
        return null;
      }
    }));
  }

  private checkPermission(): Observable<boolean> {
    if (Notification.permission === 'default') {
      return this.requestPermission();
    }
    else if (Notification.permission === 'granted') {
      return of(true);
    }
    else {
      return of(false);
    }
  }

  private requestPermission(): Observable<boolean> {
    return new Observable(sub => {
      Notification.requestPermission().then(function(result) {
        if (result === 'granted') {
          sub.next(true);
        } else {
          sub.next(false);
        }
        sub.complete();
      });
    });
  }

}
