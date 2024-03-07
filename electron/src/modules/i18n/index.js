const { app } = require("electron");

const DEFAULT_LOCALE = 'en';
const TRANSLATIONS = getLocaleFile();


translate = (key) => {
  return TRANSLATIONS[key] || key;
}

function getLocaleFile() {
  const locale = getLocale();
  const src = `./${locale}.json`;
  const file = require(src);
  return file;
}

function getLocale() {
  const osLocale = app.getLocaleCountryCode().toLowerCase();
  console.log('OS Locale:', osLocale);

  switch (osLocale) {
    case 'us':
    case 'gb': return 'en';
    case 'pl': return 'pl';
  }
  return DEFAULT_LOCALE;
}


module.exports = { translate };
