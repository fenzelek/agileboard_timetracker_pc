// @ts-ignore
const packageJsonAngular = require('../../package.json');
// @ts-ignore
const packageJsonCordova = require('../../../cordova/package.json');

const apiMockUrl = 'http://localhost:3000';
const apiUrl = 'http://dev.api.cep.devpark.pl';


export const environment = {
  production: false,
  electron: false,
  cordova: true,
  fakeApi: false,
  envName: 'Cordova -- Dev',
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
    app: packageJsonCordova.version,
    angular: packageJsonAngular.dependencies['@angular/core'],
  },
  dataRefreshTime: 5 * 60 * 1000, // 5 min
  timeFrameDuration: 10 * 60 * 1000, // 10 min
  notRegisteringTimeWarningTimeout: 10 * 60 * 1000, // 10 min
  activityIdleValue: 0,
  screensPerFrame: 1,
};
