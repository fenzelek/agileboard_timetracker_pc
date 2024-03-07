import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DesktopContentService, DesktopContentView } from 'src/app/services/desktop-content.service';
import { NativeService } from 'src/app/services/native.service';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { NotificationService } from 'src/core/notifications/notification.service';
import { CompaniesFacade } from 'src/core/store/companies/companies.facade';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { MobileTimesComponent } from '../../../pages/mobile-times/mobile-times.component';


@Component({
  selector: 'app-desktop-times',
  templateUrl: './desktop-times.component.html',
  styleUrls: ['./desktop-times.component.scss']
})
export class DesktopTimesComponent extends MobileTimesComponent {

  constructor(
    protected http: HttpClient,
    protected companiesFacade: CompaniesFacade,
    protected cd: ChangeDetectorRef,
    protected nativeService: NativeService,
    protected timeStore: TimeStore,
    protected notificationService: NotificationService,
    protected authFacade: AuthFacade,
    private desktopContentService: DesktopContentService,
  ) {
    super(http, companiesFacade, cd, nativeService, timeStore, notificationService, authFacade);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  close(event?: KeyboardEvent) {
    if (!event || (event && event.which === 27)) { // 27 = esc
      this.desktopContentService.open(DesktopContentView.TASKLIST);
    }
  }

}
