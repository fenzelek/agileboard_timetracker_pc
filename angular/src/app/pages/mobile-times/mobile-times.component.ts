import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NativeService } from 'src/app/services/native.service';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { NotificationService } from 'src/core/notifications/notification.service';
import { CompaniesFacade } from 'src/core/store/companies/companies.facade';
import { parseTime, repeat } from 'src/core/timeStore/helpers';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';

interface DayTimeResponse {
  data: {
    sum_time: number;
  };
}

class MonthItem {
  name: string;
  constructor(public index: number) {  // 1 - based (1 = January)
    this.name = `tt.months.${index}`;
  }
}

interface TimeItem {
  date: Date;
  time?: Time;
}


@Component({
  selector: 'app-mobile-times',
  templateUrl: './mobile-times.component.html',
  styleUrls: ['./mobile-times.component.scss']
})
export class MobileTimesComponent implements OnInit {
  loading: boolean;

  userIsAdmin: boolean;

  months: MonthItem[] = [];
  years: number[] = [];

  year: number;
  month: number;

  times: TimeItem[];
  monthTime: Time;

  constructor(
    protected http: HttpClient,
    protected companiesFacade: CompaniesFacade,
    protected cd: ChangeDetectorRef,
    protected nativeService: NativeService,
    protected timeStore: TimeStore,
    protected notificationService: NotificationService,
    protected authFacade: AuthFacade,
  ) {
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();

    repeat(12, index => this.months.push(new MonthItem(index + 1)));
    repeat(5, index => this.years.push(currentYear - index));

    this.year = currentDate.getUTCFullYear();
    this.month = currentDate.getUTCMonth() + 1;
  }

  ngOnInit(): void {
    this.authFacade.isAdmin().subscribe(is => {
      this.userIsAdmin = is;
      this.fetchTimes();
    });
  }

  fetchTimes(): void {
    this.times = [];
    this.monthTime = null;
    
    if (!this.checkConnection()) return;

    this.loading = true;

    let finishedRequests = 0;

    const daysToDisplay = this.getDaysToDisplay();

    repeat(daysToDisplay, index => {
      this.fetchDayTime(index + 1)
      .pipe(finalize(() => {
        finishedRequests ++;
        if (finishedRequests === daysToDisplay) {
          this.sumMonthTime();
          this.loading = false;
          this.cd.detectChanges();
        }
      }))
      .subscribe();
    });
  }

  isWeekend(date: Date): boolean {
    const weekDay = date.getDay();
    return weekDay === 0;
  }

  private checkConnection(): boolean {
    if (this.timeStore.isOffline) {
      return false;
    }

    if (!this.nativeService.networkOnline) {
      this.notificationService.toaster('info', 'tt.info.no-internet');
      return false;
    }

    return true;
  }

  private getDaysInMonth(): number {
    return new Date(this.year, this.month, 0).getDate();
  }

  private getDaysToDisplay(): number {
    const currentDate = new Date();
    const isCurrentMonth = this.year === currentDate.getFullYear() && this.month === (currentDate.getMonth() + 1);

    if (isCurrentMonth) {
      return currentDate.getDate();
    } else {
      return this.getDaysInMonth();
    }
  }

  private sumMonthTime(): void {
    if (!this.times.length) {
      this.monthTime = null;
      return;
    }

    const sum = this.times.reduce((prev, curr) => {
      const inSeconds = curr.time.seconds + (curr.time.minutes * 60) + (curr.time.hours * 3600);
      return prev + inSeconds;
    }, 0);

    this.monthTime = parseTime(sum);
  }
  

  private fetchDayTime(day: number): Observable<TimeItem> {
    const url = `/integrations/time_tracking/activities/summary`;

    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = this.month < 10 ? `0${this.month}` : `${this.month}`;
    const dateStr = `${this.year}-${monthStr}-${dayStr}`;

    let params = new HttpParams().appendAll({
      selected_company_id: `${this.companiesFacade.selectedCompany.data.id}`,
      min_utc_started_at: `${dateStr} 00:00:00`,
      max_utc_started_at: `${dateStr} 23:59:59`,
    });

    if (this.userIsAdmin) {
      params = params.append('user_id', `${this.authFacade.user.id}`);
    }

    const date = new Date(this.year, this.month - 1, day);
    const timeItem: TimeItem = { date };

    this.times[day - 1] = timeItem;

    return this.http.get<DayTimeResponse>(url, { params }).pipe(
      map(resp => {
        const time = parseTime(resp.data.sum_time);
        timeItem.time = time;
        return timeItem;
      }),
    );
  }

}
