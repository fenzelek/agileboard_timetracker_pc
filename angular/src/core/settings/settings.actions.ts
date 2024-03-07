import { createAction, props } from '@ngrx/store';

import { Language, Theme } from './settings.model';


export const actionSettingsChangeLanguage = createAction(
  '[Settings] Change Language',
  props<{ language: Language }>()
);

export const actionSettingsChangeTheme = createAction(
  '[Settings] Change Theme',
  props<{ theme: Theme }>()
);
export const actionSettingsChangeAutoNightMode = createAction(
  '[Settings] Change Auto Night Mode',
  props<{ autoNightMode: boolean }>()
);

export const actionSettingsChangeStickyHeader = createAction(
  '[Settings] Change Sticky Header',
  props<{ stickyHeader: boolean }>()
);

export const actionSettingsChangeAnimationsPage = createAction(
  '[Settings] Change Animations Page',
  props<{ pageAnimations: boolean }>()
);

export const actionSettingsChangeAnimationsPageDisabled = createAction(
  '[Settings] Change Animations Page Disabled',
  props<{ pageAnimationsDisabled: boolean }>()
);

export const actionSettingsChangeAnimationsElements = createAction(
  '[Settings] Change Animations Elements',
  props<{ elementsAnimations: boolean }>()
);
export const actionSettingsChangeHour = createAction(
  '[Settings] Change Hours',
  props<{ hour: number }>()
);

export const actionSettingsGetAppVersion = createAction(
  '[Settings] Get Version',
  props<{ version: string }>()
);
export const actionSettingsSetAppVersion = createAction(
  '[Settings] Set Version',
  props<{ version: string }>()
);

// user profile
export const userProfileSaveR = createAction(
  '[Settings] Save User Profile',
  props<{ version: string }>()
);
export const userProfileSaveS = createAction(
  '[Settings] Save User Profile',
  props<{ version: string }>()
);
export const userProfileSaveE = createAction(
  '[Settings] Save User Profile',
  props<{ version: string }>()
);

export const actionSettingsSetSidebarAutoCollapse = createAction(
  '[Settings] Set Sidebar Auto Collapse',
  props<{ sidebarAutoCollapse: boolean }>()
);
export const actionSettingsGetSidebarAutoCollapse = createAction(
  '[Settings] Get Sidebar Auto Collapse',
  props<{ sidebarAutoCollapse: boolean }>()
);
export const actionSettingsChangeTaskListPageSize = createAction(
  '[Settings] Set task list page size',
  props<{ taskListPageSize: number }>()
);
export const actionSettingsChangeOpenCompanyIfOnlyOne = createAction(
  '[Settings] Set if automatically open company if only one',
  props<{ openCompanyIfOnlyOne: boolean }>()
);
export const actionSettingsChangeTaskDetailsPosition = createAction(
  '[Settings] Change task details position',
  props<{ position: 'right' | 'bottom' }>()
);
