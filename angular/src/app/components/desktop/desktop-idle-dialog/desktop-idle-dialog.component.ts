import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { parseTime } from 'src/core/timeStore/helpers';
import { TimeStore } from 'src/core/timeStore/timeStore';
import DesktopDialogsService from '../../../services/desktop-dialogs.service';


@Component({
  selector: 'app-desktop-idle-dialog',
  templateUrl: './desktop-idle-dialog.component.html',
  styleUrls: ['./desktop-idle-dialog.component.scss']
})
export class DesktopIdleDialogComponent implements OnInit {
  idleTime: string;
  isOpen$ = this.desktopDialogsService.isOpen$('idle');

  constructor(
    private timeStore: TimeStore,
    private cd: ChangeDetectorRef,
    private desktopDialogsService: DesktopDialogsService,
  ) { }

  ngOnInit(): void {
    this.subscribeIdleTime();
  }

  subscribeIdleTime() {
    this.timeStore.idleTime$.subscribe(seconds => {
      const time = parseTime(seconds);
      let displayTime = '';

      if (time.hours) {
        displayTime = `${time.hours}h `;
      }

      displayTime += `${time.minutes}m`;

      this.idleTime = displayTime;

      this.cd.detectChanges();
    });
  }

  keepIdleTime() {
    this.timeStore.keepIdleTime();
    this.desktopDialogsService.close('idle');
    this.cd.detectChanges();
  }

  removeIdleTime() {
    this.timeStore.rejectIdleTime();
    this.desktopDialogsService.close('idle');
    this.cd.detectChanges();
  }

}
