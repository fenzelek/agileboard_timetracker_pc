import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { tuneCordova } from './cordova-tune';
import { environment } from './environments/environment';
// import 'hammerjs';

console.log('environment >>', environment);


if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

if (environment.cordova) {
  // cordova init
  document.addEventListener('deviceready', () => {
    tuneCordova();
    bootstrap();
  }, false);
} else {
  bootstrap();
}
// bootstrap();
