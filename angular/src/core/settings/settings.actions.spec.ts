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
import { NIGHT_MODE_THEME } from './settings.model';

describe('Settings Actions', () => {
  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeTheme action
   *
   * @test
   */
  it('should create ActionSettingsChangeTheme action', () => {
    const action = actionSettingsChangeTheme({
      theme: NIGHT_MODE_THEME
    });

    expect(action.type).toEqual(actionSettingsChangeTheme.type);
    expect(action.theme).toEqual(NIGHT_MODE_THEME);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeAnimationsElements action
   *
   * @test
   */
  it('should create ActionSettingsChangeAnimationsElements action', () => {
    const action = actionSettingsChangeAnimationsElements({
      elementsAnimations: true
    });

    expect(action.type).toEqual(actionSettingsChangeAnimationsElements.type);
    expect(action.elementsAnimations).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeAnimationsPage action
   *
   * @test
   */
  it('should create ActionSettingsChangeAnimationsPage action', () => {
    const action = actionSettingsChangeAnimationsPage({
      pageAnimations: true
    });

    expect(action.type).toEqual(actionSettingsChangeAnimationsPage.type);
    expect(action.pageAnimations).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeAnimationsPageDisabled action
   *
   * @test
   */
  it('should create ActionSettingsChangeAnimationsPageDisabled action', () => {
    const action = actionSettingsChangeAnimationsPageDisabled({
      pageAnimationsDisabled: true
    });

    expect(action.type).toEqual(
      actionSettingsChangeAnimationsPageDisabled.type
    );
    expect(action.pageAnimationsDisabled).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeAutoNightMode action
   *
   * @test
   */
  it('should create ActionSettingsChangeAutoNightMode action', () => {
    const action = actionSettingsChangeAutoNightMode({
      autoNightMode: true
    });

    expect(action.type).toEqual(actionSettingsChangeAutoNightMode.type);
    expect(action.autoNightMode).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeLanguage action
   *
   * @test
   */
  it('should create ActionSettingsChangeLanguage action', () => {
    const action = actionSettingsChangeLanguage({
      language: 'en'
    });

    expect(action.type).toEqual(actionSettingsChangeLanguage.type);
    expect(action.language).toEqual('en');
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeStickyHeader action
   *
   * @test
   */
  it('should create ActionSettingsChangeStickyHeader action', () => {
    const action = actionSettingsChangeStickyHeader({
      stickyHeader: true
    });

    expect(action.type).toEqual(actionSettingsChangeStickyHeader.type);
    expect(action.stickyHeader).toEqual(true);
  });

  /**
   * @Feature Settings
   * @Scenario Settings Actions
   * @Case should create ActionSettingsChangeHour action
   *
   * @test
   */
  it('should create ActionSettingsChangeHour action', () => {
    const action = actionSettingsChangeHour({
      hour: 7
    });

    expect(action.type).toEqual(actionSettingsChangeHour.type);
    expect(action.hour).toEqual(7);
  });
});
