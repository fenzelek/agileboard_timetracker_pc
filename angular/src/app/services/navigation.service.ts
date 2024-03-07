import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

type Handler = () => any;

export interface NavHandlerConfig {
  removeHandler: () => any;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private handlers: { [key: string]: Handler } = {};
  private lastHandlerId = 0;

  constructor(
    private router: Router,
    private location: Location,
  ) {
    this.listenToBackButtonPress();
  }

  addBackButtonHandler(handler: Handler): NavHandlerConfig {
    const id = this.lastHandlerId ++;
    this.handlers[id] = handler;

    return {
      removeHandler: () => delete this.handlers[id],
    };
  }

  back() {
    this.location.back();
  }

  minimize() {
    (window as any).plugins.appMinimize.minimize();
  }

  private listenToBackButtonPress() {
    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => this.handleBackButtonPress());
    }, false);
  }

  private handleBackButtonPress() {
    const handlersExist = !!Object.keys(this.handlers).length;

    if (handlersExist) {
      this.runBackButtonHandlers();
    } else {
      this.runBackButtonDefaultBehaviour();
    }
  }

  private runBackButtonHandlers() {
    Object.keys(this.handlers).forEach(key => this.handlers[key]());
  }

  private runBackButtonDefaultBehaviour() {
    this.minimize();
  }

}
