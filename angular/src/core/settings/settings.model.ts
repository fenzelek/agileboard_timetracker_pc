export enum Theme {
  default = 'default-theme',
  dark = 'dark-theme',
  dark2 = 'dark-v2-theme',
}

export type NightTheme = Theme.dark;
export const NIGHT_MODE_THEME = Theme.dark;

// export type Theme = Theme.default | Theme.dark | Theme.dark2;

export type Language = 'en' | 'pl';

export interface SettingsState {
  language: string;
  theme: Theme;
  autoNightMode: boolean;
  nightTheme: NightTheme;
  stickyHeader: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
  hour: number;
  appVersion: string;
  sidebarAutoCollapse: boolean;
  taskListPageSize: number;
  openCompanyIfOnlyOne: boolean;
  taskDetailsPosition: 'right' | 'bottom';
}
