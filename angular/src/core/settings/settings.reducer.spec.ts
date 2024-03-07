import { initialState, settingsReducer } from './settings.reducer';

import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeHour,
  actionSettingsChangeLanguage,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeTheme
} from './settings.actions';

describe('SettingsReducer', () => {
  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should return default state
   *
   * @test
   */
  it('should return default state', () => {
    const action = {} as any;
    const state = settingsReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update language
   *
   * @test
   */
  it('should update language', () => {
    const action = actionSettingsChangeLanguage({ language: 'pl' });
    const state = settingsReducer(undefined, action);
    expect(state.language).toEqual('pl');
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update theme
   *
   * @test
   */
  it('should update theme', () => {
    const action = actionSettingsChangeTheme({ theme: 'dark' });
    const state = settingsReducer(undefined, action);
    expect(state.theme).toEqual('dark');
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update pageAnimations
   *
   * @test
   */
  it('should update pageAnimations', () => {
    const action = actionSettingsChangeAnimationsPage({
      pageAnimations: false
    });
    const state = settingsReducer(undefined, action);
    expect(state.pageAnimations).toEqual(false);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update pageAnimationsDisabled and pageAnimations
   *
   * @test
   */
  it('should update pageAnimationsDisabled and pageAnimations', () => {
    const action = actionSettingsChangeAnimationsPageDisabled({
      pageAnimationsDisabled: true
    });
    const state = settingsReducer(undefined, action);
    expect(state.pageAnimationsDisabled).toEqual(true);
    expect(state.pageAnimations).toEqual(false);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update elementsAnimations
   *
   * @test
   */
  it('should update elementsAnimations', () => {
    const action = actionSettingsChangeAnimationsElements({
      elementsAnimations: false
    });
    const state = settingsReducer(undefined, action);
    expect(state.elementsAnimations).toEqual(false);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update autoNightMode
   *
   * @test
   */
  it('should update autoNightMode', () => {
    const action = actionSettingsChangeAutoNightMode({
      autoNightMode: true
    });
    const state = settingsReducer(undefined, action);
    expect(state.autoNightMode).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update stickyHeader
   *
   * @test
   */
  it('should update stickyHeader', () => {
    const action = actionSettingsChangeStickyHeader({
      stickyHeader: false
    });
    const state = settingsReducer(undefined, action);
    expect(state.stickyHeader).toEqual(false);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Reducer
   * @Case should update hour
   *
   * @test
   */
  it('should update hour', () => {
    const action = actionSettingsChangeHour({
      hour: 7
    });
    const state = settingsReducer(undefined, action);
    expect(state.hour).toEqual(7);
  });
});
