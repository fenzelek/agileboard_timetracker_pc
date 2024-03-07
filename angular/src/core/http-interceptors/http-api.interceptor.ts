import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { AuthFacade } from '../auth/auth.facade';
import { environment } from '../../environments/environment';


@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {

  constructor(
    private translateService: TranslateService,
    private authFacade: AuthFacade,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.isApiUrl(req.url)) {
      const reqClone = this.modifyApiReq(req);
      return next.handle(reqClone);
    } else {
      // Continue without modifications
      return next.handle(req);
    }

  }


  private modifyApiReq(req: HttpRequest<any>) {
    const reqConfig: any = {};

    reqConfig.url = this.mergeApiUrl(req.url);
    reqConfig.setHeaders = {
      'Accept-Language': this.translateService.currentLang,
    }

    reqConfig.setHeaders.Authorization = `Bearer ${this.getJwtToken()}`;

    return req.clone(reqConfig);
  }

  private isApiUrl(url: string): boolean {
    return !url.includes('assets/');
    // return url.includes('/api/') || url.includes('/oauth/') || url.includes('/auth/logout');
  }

  private mergeApiUrl(url: string) {
    url = `/${url}`.replace(/\/+/g, '/');
    return `${environment.apiUrl}${url}`;
  }

  private getJwtToken() {
    let token = '';
    this.authFacade.token$.pipe(take(1)).subscribe(t => (token = t));
    return token;
  }

}
