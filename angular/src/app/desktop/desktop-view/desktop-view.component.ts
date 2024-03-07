import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import DesktopDialogsService from 'src/app/services/desktop-dialogs.service';
import { NativeService } from 'src/app/services/native.service';
import { OfflineService } from 'src/app/services/offline.service';
import { ElectronService, ViewMode } from 'src/electronService/electron.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-desktop-view',
  templateUrl: './desktop-view.component.html',
  styleUrls: ['./desktop-view.component.scss']
})
export class DesktopViewComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();

  showNoInternet: boolean;

  ViewMode = ViewMode;

  constructor(
    public electronService: ElectronService,
    private cd: ChangeDetectorRef,
    private desktopDialogsService: DesktopDialogsService,
    private nativeService: NativeService,
    private offlineService: OfflineService,
  ) { }

  ngOnInit(): void {
    this.subscribeConnection();
    this.checkConnection();
    this.subscribeIdle();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

  private subscribeConnection() {
    this.nativeService.networkOnline$.subscribe(online => {
      if (online) {
        this.checkConnection();
      }
    });
  }

  checkConnection() {
    this.showNoInternet = this.offlineService.shouldShowNoInternet();
    this.cd.detectChanges();
  }

  subscribeIdle() {
    if (!environment.electron) return;

    this.electronService.onIdleStart().pipe(takeUntil(this.uns$)).subscribe(() => {
      console.log('onIdleStart: idle dialog open');
      this.openIdleDialog();
    });
  }

  openIdleDialog() {
    this.desktopDialogsService.open('idle');
    this.cd.detectChanges();
  }

  isNonCompact(): boolean {
    return this.electronService.currentViewMode === ViewMode.MEDIUM || this.electronService.currentViewMode === ViewMode.WIDE;
  }

}
