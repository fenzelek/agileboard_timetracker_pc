import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { DesktopContentService, DesktopContentView } from 'src/app/services/desktop-content.service';
import { NativeService } from 'src/app/services/native.service';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { AppState } from 'src/core/core.state';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { TimeFrameBase } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-unsynchronized',
  templateUrl: './unsynchronized.component.html',
  styleUrls: ['./unsynchronized.component.scss']
})
export class UnsynchronizedComponent implements OnInit {
  private userId: number;

  private untracked: TimeFrameBase[];
  public pageData: TimeFrameBase[] = [];
  public isMobile = environment.cordova;

  displayedColumns: string[] = ['projectName', 'taskName', 'date', 'from', 'to', 'dispose'];

  // pagination data
  pageIndex = 0;
  pageSize = 10;
  allDataLength = 0;
  protected startIndex = 0;
  protected endIndex = this.pageSize;

  constructor(
    protected ls: LocalStorageService,
    protected store: Store<AppState>,
    protected nativeService: NativeService,
    protected authFacade: AuthFacade,
    protected timeStore: TimeStore,
    private desktopContentService: DesktopContentService,
  ) { }

  ngOnInit() {
    this.subscribeUser();
    this.updatePageData();
    this.updatePagination();
  }

  private subscribeUser() {
    this.authFacade.user$.subscribe(user => {
      this.userId = user ? user.id : null;
      this.untracked = this.ls.getItem(`TIME-FRAMES-${this.userId}`);
    });
  }

  protected updatePagination() {
    this.allDataLength = this.untracked ? this.untracked.length : 0;
    const lastPageIndex = (Math.ceil(this.allDataLength / this.pageSize)) - 1;

    if (this.pageIndex > lastPageIndex) {
      this.pageIndex = lastPageIndex;
    }

    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;

    this.updatePageData();
  }

  protected updatePageData() {
    this.pageData = this.untracked ? this.untracked.slice(this.startIndex, this.endIndex) : null;
  }
  changePage(ev: PageEvent) {
    this.pageSize = ev.pageSize;
    this.pageIndex = ev.pageIndex;
    this.startIndex = ev.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    this.updatePageData();
  }

  taskListWrapperScrollTop() {
    const wrapper = document.querySelector('.task-list-wrapper');
    wrapper.scrollTo({ behavior: 'smooth', top: 0 });
  }

  onRemove(task: TimeFrameBase) {
    let index = this.untracked.indexOf(task);
    this.untracked.splice(index, 1);
    this.ls.setItem(`TIME-FRAMES-${this.userId}`, this.untracked);
    this.pageData = this.pageData.filter((el: TimeFrameBase) => el !== task);
    this.timeStore.refreshIsSynchronized();
  }

  onRemoveAll() {
    this.ls.setItem(`TIME-FRAMES-${this.userId}`, []);
    this.pageData = [];
    this.untracked = [];
    this.timeStore.refreshIsSynchronized();
  }

  close(event?: KeyboardEvent) {
    if (!event || (event && event.which === 27)) { // 27 = esc
      this.desktopContentService.open(DesktopContentView.TASKLIST);
    }
  }

  getDate(secunds: number) {
    return new Date(secunds * 1000);
  }

}
