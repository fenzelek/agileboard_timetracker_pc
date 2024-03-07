import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import { DesktopToolbarComponent } from '../../desktop/desktop-toolbar/desktop-toolbar.component';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { AppState } from 'src/core/core.state';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { DataService } from 'src/app/services/data.service';
import { DesktopContentService } from 'src/app/services/desktop-content.service';
import { CompaniesFacade } from 'src/core/store/companies/companies.facade';
import { ElectronService } from 'src/electronService/electron.service';


@Component({
  selector: 'app-mobile-toolbar',
  templateUrl: './mobile-toolbar.component.html',
  styleUrls: ['./mobile-toolbar.component.scss']
})
export class MobileToolbarComponent extends DesktopToolbarComponent {

  @Input() title = "";

  constructor(
    protected authFacade: AuthFacade,
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef,
    protected ls: LocalStorageService,
    protected companiesFacade: CompaniesFacade,
    protected desktopContentService: DesktopContentService,
    protected electronService: ElectronService,
    public timeStore: TimeStore,
    private dataService: DataService,
  ) { 
    super(authFacade, store, cd, ls, companiesFacade, desktopContentService, electronService, timeStore);
  }

  refreshData() {
    this.dataService.reloadData();
  }

}
