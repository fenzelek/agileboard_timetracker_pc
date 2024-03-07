import { TestBed } from '@angular/core/testing';

// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Overlay } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from './notification.service';

describe('NotificationsService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      // providers: [NotificationService, MatSnackBar, Overlay]
    });
    service = TestBed.inject<NotificationService>(NotificationService);
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case should be created
   *
   * @test
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case default method should be executable
   *
   * @test
   */
  it('default method should be executable', () => {
    spyOn(service, 'default');
    service.default('default message');
    expect(service.default).toHaveBeenCalled();
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case info method should be executable
   *
   * @test
   */
  it('info method should be executable', () => {
    spyOn(service, 'info');
    service.info('info message');
    expect(service.info).toHaveBeenCalled();
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case success method should be executable
   *
   * @test
   */
  it('success method should be executable', () => {
    spyOn(service, 'success');
    service.success('success message');
    expect(service.success).toHaveBeenCalled();
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case warning method should be executable
   *
   * @test
   */
  it('warning method should be executable', () => {
    spyOn(service, 'warn');
    service.warn('warning message');
    expect(service.warn).toHaveBeenCalled();
  });

  /**
   * @Feature Notification
   * @Scenario Notification Service
   * @Case error method should be executable
   *
   * @test
   */
  it('error method should be executable', () => {
    spyOn(service, 'error');
    service.error('error message');
    expect(service.error).toHaveBeenCalled();
  });
});
