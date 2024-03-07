import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

const dialogs = ['idle', 'deps'];
type Dialogs = 'idle' | 'deps';

interface DialogsConfig {
  [name: string]: DialogProps;
}

interface DialogProps {
  isOpen: BehaviorSubject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export default class DesktopDialogsService {

  private dialogs: DialogsConfig = {};
  
  constructor() {
    // create config
    dialogs.forEach(name => {
      this.dialogs[name] = { isOpen: new BehaviorSubject<boolean>(false) };
    });
  }

  isOpen$(dialogName: Dialogs) {
    return this.dialogs[dialogName].isOpen.asObservable();
  }

  open(dialogName: Dialogs) {
    this.dialogs[dialogName].isOpen.next(true);
  }

  close(dialogName: Dialogs) {
    this.dialogs[dialogName].isOpen.next(false);
  }
}
