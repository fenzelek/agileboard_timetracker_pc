// @ts-ignore
const packageJsonAngular = require('../../package.json');
// @ts-ignore
const packageJsonElectron = require('../../../electron/package.json');

const apiMockUrl = 'http://localhost:3000';
const apiUrl = 'http://dev.api.cep.devpark.pl';


export const environment = {
  production: false,
  electron: true,
  cordova: false,
  fakeApi: true,
  envName: 'Electron -- Dev',
  apiUrl: apiUrl,
  abUrl: 'https://app.agileboard.me',
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
    app: packageJsonElectron.version,
    angular: packageJsonAngular.dependencies['@angular/core'],
  },
  dataRefreshTime: 5 * 60 * 1000, // 5 min
  // timeFrameDuration: 10 * 60 * 1000, // 10 min
  timeFrameDuration: 60 * 1000, // 1 min
  // notRegisteringTimeWarningTimeout: 10 * 1000, // 10 sec
  notRegisteringTimeWarningTimeout: 10 * 60 * 1000, // 10 min
  activityIdleValue: 0,
  screensPerFrame: 1,
};
