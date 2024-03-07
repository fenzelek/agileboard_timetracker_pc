import { SettingsState, NIGHT_MODE_THEME, Theme } from './settings.model';
import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeHour,
  actionSettingsChangeLanguage,
  actionSettingsChangeOpenCompanyIfOnlyOne,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeTaskDetailsPosition,
  actionSettingsChangeTaskListPageSize,
  actionSettingsChangeTheme,
  actionSettingsSetAppVersion,
  actionSettingsSetSidebarAutoCollapse,
} from './settings.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: SettingsState = {
  language: 'en',
  theme: Theme.default,
  autoNightMode: false,
  nightTheme: NIGHT_MODE_THEME,
  stickyHeader: false,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true,
  hour: 0,
  appVersion: '',
  sidebarAutoCollapse: true,
  taskListPageSize: 5,
  openCompanyIfOnlyOne: false,
  taskDetailsPosition: 'bottom'
};

const reducer = createReducer(
  initialState,
  on(
    actionSettingsChangeLanguage,
    actionSettingsChangeTheme,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeStickyHeader,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeHour,
    actionSettingsChangeTaskListPageSize,
    actionSettingsChangeOpenCompanyIfOnlyOne,
    (state, action) => {
      const props = { ...action };
      delete props.type;
      return { ...state, ...props };
    }
  ),
  on(
    actionSettingsChangeAnimationsPageDisabled,
    (state, { pageAnimationsDisabled }) => ({
      ...state,
      pageAnimationsDisabled,
      pageAnimations: false
    })
  ),
  on(actionSettingsSetAppVersion, (state, { version }) => ({
    ...state,
    appVersion: version
  })),
  on(actionSettingsSetSidebarAutoCollapse, (state, { sidebarAutoCollapse }) => ({
    ...state,
    sidebarAutoCollapse: sidebarAutoCollapse
  })),
  on(actionSettingsChangeTaskDetailsPosition, (state, { position }) => ({
    ...state,
    taskDetailsPosition: position
  }))
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
