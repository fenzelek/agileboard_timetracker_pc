import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ElectronService, ViewMode } from 'src/electronService/electron.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-desktop-footer-left',
  templateUrl: './desktop-footer-left.component.html',
  styleUrls: ['./desktop-footer-left.component.scss']
})
export class DesktopFooterLeftComponent implements OnInit, OnDestroy {
  uns$ = new Subject<void>();

  version = environment.versions.app;
  ViewMode = ViewMode;

  constructor(
    private dataService: DataService,
    public electronService: ElectronService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

  refreshData() {
    this.dataService.reloadData();
  }

  changeViewMode(mode: ViewMode) {
    this.electronService.changeViewMode(mode);
  }

  isNonCompact(): boolean {
    return this.electronService.currentViewMode === ViewMode.MEDIUM || this.electronService.currentViewMode === ViewMode.WIDE;
  }

}
