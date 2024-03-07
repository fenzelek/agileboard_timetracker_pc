import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NotificationService} from '../notifications/notification.service';
import {AuthFacade} from '../auth/auth.facade';
import { ElectronService } from 'src/electronService/electron.service';

/** Displays HttpErrorResponse error  */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private authFacade: AuthFacade,
    private electronService: ElectronService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(

      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {

            const noInternet = err.status === 0;

            if (noInternet) {
              this.notificationService.toaster('info', 'tt.info.no-internet');
            }

            // Backend: 401 - wrong login data / unauthorized
            else if (err.status === 401) {
              if (this.authFacade.isAuthenticated) {
                this.authFacade.logout();
                this.electronService.logout();
              }
              this.notificationService.toaster('error', 'tt.errors.error.401');
            } 

            else if (err.status === 403 && err.error.code === 'auth.user_already_logged') {
              console.warn('Already logged in');
            }

            else {
              this.notificationService.toaster('error', 'tt.errors.error-occurred');
            }
          }
        }
      }),

    );
  }

}
