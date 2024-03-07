// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// @ts-ignore
const packageJsonAngular = require('../../package.json');

const apiMockUrl = 'http://localhost:3000';
const apiUrl = 'http://dev.api.cep.devpark.pl';


export const environment = {
  production: false,
  electron: false,
  cordova: false,
  fakeApi: false,
  envName: 'Web -- Dev',
  apiUrl: apiUrl,
  abUrl: 'http://dev.cep.devpark.pl',
  test: false,
  i18nPrefix: 'assets',
  oauth: {
    grant_type : 'password',
    client_id : '91e94929-de3c-4b55-a33f-2201f3d35c5d',
    client_secret : 'jRfZY3kx0X4jx6PTQuXRnPxZdXcAffa9BPITXalF',
    scope : ''
  },
  versions: {
    core: packageJsonAngular.version,
    app: packageJsonAngular.version,
    angular: packageJsonAngular.dependencies['@angular/core'],
  },
  dataRefreshTime: 5 * 60 * 1000, // 5 min
  timeFrameDuration: 10 * 60 * 1000, // 10 min
  notRegisteringTimeWarningTimeout: 10 * 60 * 1000, // 10 min
  activityIdleValue: 0,
  screensPerFrame: 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
