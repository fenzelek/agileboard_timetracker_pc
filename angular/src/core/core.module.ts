// angular
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {ErrorHandler, LOCALE_ID, NgModule, Optional, SkipSelf} from '@angular/core';
import localePL from '@angular/common/locales/pl';
import localeEN from '@angular/common/locales/en';
import localeRU from '@angular/common/locales/ru';
import localeUA from '@angular/common/locales/ru-UA';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// store
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

// translate
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// notifications
import {ToasterModule} from 'angular2-toaster';

// icons
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCogs,
  faEdit,
  faLanguage,
  faLightbulb,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faPaintBrush,
  faPalette,
  faPlay,
  faSearch,
  faStop,
  faStream,
  faTimes,
  faUserCircle,
  faWindowMaximize,
  faTasks,
  faExternalLinkAlt,
  faInfoCircle,
  faArrowUp,
  faArrowDown,
  faBoxOpen,
  faRedo,
  faCircleNotch,
  faBackspace,
  faUser,
  faSignInAlt,
  faPlus,
  faDatabase,
  faCaretRight,
  faCaretDown,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

// material
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';

// core
import {effects, metaReducers, reducers} from './core.state';
import {CustomSerializer} from './router/custom-serializer';
import {AuthFacade} from './auth/auth.facade';
import {AppErrorHandler} from './error-handler/app-error-handler.service';
import {environment} from '../environments/environment';
import {HttpErrorInterceptor} from './http-interceptors/http-error.interceptor';
import {HttpApiInterceptor} from './http-interceptors/http-api.interceptor';

// services, pipes, etc..
import {ElectronService} from 'src/electronService/electron.service';
import {AppRoutingModule} from 'src/app/app-routing.module';
import {ProjectsFacade} from "./store/projects/projects.facade";
import {TimePipe} from './pipes/time.pipe';
import {TasksFacade} from './store/tasks/tasks.facade';
import {TimeStore} from './timeStore/timeStore';
import {PaginatorIntlFactory} from './providers/paginator-intl.factory';
import {CngHtmlCompilerModule} from '@codehint-ng/html-compiler';
import {TasksService} from './store/tasks/tasks.service';


function HttpLoaderFactory(http: HttpClient) {
  const res = new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/i18n/`,
    `.json?v=${environment.versions.app}`
  );
  return res;
}


@NgModule({
  imports: [
    // angular
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CngHtmlCompilerModule,
    // routing
    AppRoutingModule,
    
    // store
    StoreDevtoolsModule.instrument({ name: 'Time Tracker', maxAge: 25, logOnly: environment.production }),

    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),

    // translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    // notifications
    ToasterModule,

    // icons
    FontAwesomeModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
  ],

  declarations: [
    TimePipe,
  ],

  providers: [
    AuthFacade,
    ElectronService,
    ProjectsFacade,
    TasksFacade,
    TasksService,
    TimeStore,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpApiInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    {
      provide: LOCALE_ID,
      deps: [TranslateService],
      useFactory: (s: TranslateService) => s.currentLang || 'en'
    },
    {
      provide: MatPaginatorIntl,
      useFactory: (translate: TranslateService) => {
        const service = new PaginatorIntlFactory();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    },
  ],

  exports: [
    // angular
    FormsModule,
    ReactiveFormsModule,

    // material
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,

    // 3rd party
    FontAwesomeModule,
    TranslateModule,
    CngHtmlCompilerModule,
    ToasterModule,

    TimePipe,
    DatePipe,
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    faIconLibrary: FaIconLibrary
  ) {

    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }

    registerLocaleData(localePL);
    registerLocaleData(localeEN);
    registerLocaleData(localeRU);
    registerLocaleData(localeUA);

    this.addIcons(faIconLibrary);
  }

  addIcons(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(
      faEdit,
      faPaintBrush,
      faLanguage,
      faLightbulb,
      faWindowMaximize,
      faStream,
      faUserCircle,
      faCogs,
      faBars,
      faPalette,
      faTimes,
      faPlay,
      faStop,
      faLongArrowAltRight,
      faLongArrowAltLeft,
      faSearch,
      faTasks,
      faExternalLinkAlt,
      faInfoCircle,
      faArrowUp,
      faArrowDown,
      faBoxOpen,
      faRedo,
      faCircleNotch,
      faBackspace,
      faUser,
      faSignInAlt,
      faPlus,
      faDatabase,
      faCaretRight,
      faCaretDown,
      faTrash
    );
  }

}
