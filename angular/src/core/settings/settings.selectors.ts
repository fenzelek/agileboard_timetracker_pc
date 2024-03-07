import { createSelector, createFeatureSelector } from '@ngrx/store';

import { SettingsState } from './settings.model';
import { AppState } from '../core.state';

export const selectSettingsState = createFeatureSelector
  <AppState, SettingsState>('settings');


export const selectSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state
);

export const selectSettingsStickyHeader = createSelector(
  selectSettings,
  (state: SettingsState) => state.stickyHeader
);

export const selectSettingsLanguage = createSelector(
  selectSettings,
  (state: SettingsState) => state.language
);

export const selectTheme = createSelector(
  selectSettings,
  settings => settings.theme
);

export const selectPageAnimations = createSelector(
  selectSettings,
  settings => settings.pageAnimations
);

export const selectElementsAnimations = createSelector(
  selectSettings,
  settings => settings.elementsAnimations
);

export const selectAutoNightMode = createSelector(
  selectSettings,
  settings => settings.autoNightMode
);

export const selectNightTheme = createSelector(
  selectSettings,
  settings => settings.nightTheme
);

export const selectHour = createSelector(
  selectSettings,
  settings => settings.hour
);

export const selectIsNightHour = createSelector(
  selectAutoNightMode,
  selectHour,
  (autoNightMode, hour) => autoNightMode && (hour >= 21 || hour <= 7)
);

export const selectEffectiveTheme = createSelector(
  selectTheme,
  selectNightTheme,
  selectIsNightHour,
  (theme, nightTheme, isNightHour) =>
    isNightHour ? nightTheme : theme
);

export const selectSettingsAppVersion = createSelector(
  selectSettings,
  (state: SettingsState) => state.appVersion
);

export const selectSidebarAutoCollapse = createSelector(
  selectSettings,
  (state: SettingsState) => state.sidebarAutoCollapse
);

export const selectTaskListPageSize = createSelector(
  selectSettings,
  (state: SettingsState) => state.taskListPageSize
);

export const selectTaskListOpenCompanyIfOnlyOne = createSelector(
  selectSettings,
  (state: SettingsState) => state.openCompanyIfOnlyOne
);

export const selectTaskDetailsPosition = createSelector(
  selectSettings,
  (state: SettingsState) => state.taskDetailsPosition
);

