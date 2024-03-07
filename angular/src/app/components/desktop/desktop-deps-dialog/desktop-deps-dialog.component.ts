import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import DesktopDialogsService from 'src/app/services/desktop-dialogs.service';
import { NotificationService } from 'src/core/notifications/notification.service';
import { ElectronService } from 'src/electronService/electron.service';


@Component({
  selector: 'app-desktop-deps-dialog',
  templateUrl: './desktop-deps-dialog.component.html',
  styleUrls: ['./desktop-deps-dialog.component.scss']
})
export class DesktopDepsDialogComponent implements OnInit {
  isOpen = false;
  loading = false;
  buttonsDisabled = false;

  constructor(
    private desktopDialogsService: DesktopDialogsService,
    private electronService: ElectronService,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.subscribeInstallResult();

    this.desktopDialogsService.isOpen$('deps').subscribe((val) => {
      console.log('DesktopDepsDialogComponent isOpen', val);
      this.isOpen = val;
      this.cd.detectChanges();
    });
  }

  subscribeInstallResult() {
    this.electronService.onDependenciesInstallSuccess().then(() => {
      this.notificationService.toaster('success', 'tt.deps-dialog.success');
      this.desktopDialogsService.close('deps');
      this.loading = false;
    });

    this.electronService.onDependenciesInstallError().then(() => {
      this.notificationService.toaster('error', 'tt.deps-dialog.error', 0);
      this.desktopDialogsService.close('deps');
      this.loading = false;
    });
  }

  install() {
    this.electronService.installDependencies();
    this.loading = true;
    this.buttonsDisabled = true;
    this.cd.detectChanges();
  }

  cancel() {
    this.desktopDialogsService.close('deps');
    this.cd.detectChanges();
  }

}
