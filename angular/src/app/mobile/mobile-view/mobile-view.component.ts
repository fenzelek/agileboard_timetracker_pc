import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { NavHandlerConfig, NavigationService } from 'src/app/services/navigation.service';
import { NativeService } from 'src/app/services/native.service';
import { OfflineService } from 'src/app/services/offline.service';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';

enum StepIndex {
  PROJECTS,
  TASKS,
  TRACKING,
  TIMES,
}

export class Step {
  index: number;
  title: string;
}

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileViewComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();

  StepIndex = StepIndex;

  steps: Step[] = [
    {
      index: StepIndex.PROJECTS,
      title: 'tt.title.projects',
    },
    {
      index: StepIndex.TASKS,
      title: 'tt.title.tasks',
    },
    {
      index: StepIndex.TRACKING,
      title: 'tt.title.time-tracking',
    },
    {
      index: StepIndex.TIMES,
      title: 'tt.title.times',
    }
  ];

  prevStep: Step;
  currentStep: Step;
  nextStep: Step;

  showNoInternet: boolean;

  navHandlerConfig: NavHandlerConfig;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private projectsFacade: ProjectsFacade,
    private nativeService: NativeService,
    private offlineService: OfflineService,
    private navigationService: NavigationService,
  ) {
    this.manageStepsDisplay();
  }
  
  ngOnInit(): void {
    this.handleBackButton();
    this.subscribeConnection();
    this.checkConnection();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    this.navHandlerConfig.removeHandler();
  }

  private handleBackButton() {
    this.navHandlerConfig = this.navigationService.addBackButtonHandler(() => {
      if (this.prevStep) {
        this.prev();
      } else {
        this.navigationService.minimize();
      }
      this.cd.detectChanges();
    });
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

  private manageStepsDisplay() {
    // set initial step by url
    this.route.queryParams.pipe(first()).subscribe(params => {
      const index = parseInt(params.slide) || 0;
      this.manageSteps(index);
    });
  }

  private saveStepToUrl(value: number) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { slide: value } });
  }

  private manageSteps(newIndex: number) {
    this.saveStepToUrl(newIndex);
    
    this.currentStep = this.steps[newIndex];

    if (newIndex === StepIndex.TIMES) {
      this.prevStep = this.steps[StepIndex.TRACKING];
      this.nextStep = null;
      return;
    }

    this.nextStep = newIndex === StepIndex.TRACKING ? this.steps[StepIndex.TIMES] : this.steps[StepIndex.TRACKING];

    if (newIndex === StepIndex.PROJECTS) {
      this.prevStep = this.projectIsSelected() ? this.steps[StepIndex.TASKS] : null;
    }

    if (newIndex === StepIndex.TASKS) {
      this.prevStep = this.steps[StepIndex.PROJECTS];
    }

    if (newIndex === StepIndex.TRACKING) {
      this.prevStep = this.projectIsSelected() ? this.steps[StepIndex.TASKS] : this.steps[StepIndex.PROJECTS];
    }
  }

  private projectIsSelected(): boolean {
    return !!this.projectsFacade.selectedProject;
  }

  prev() {
    if (!this.prevStep) return;
    const nextIndex = this.prevStep.index;
    this.manageSteps(nextIndex);
  }

  next() {
    if (!this.nextStep) return;
    const nextIndex = this.nextStep.index;
    this.manageSteps(nextIndex);
  }

  onProjectSelect() {
    const nextIndex = StepIndex.TASKS;
    this.manageSteps(nextIndex);
  }
  
}
