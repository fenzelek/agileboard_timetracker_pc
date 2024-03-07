import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject<LocalStorageService>(LocalStorageService);
  });

  afterEach(() => localStorage.clear());

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should be created
   *
   * @test
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case testLocalStorage should be executable
   *
   * @test
   */
  it('testLocalStorage should be executable', () => {
    spyOn(service, 'testLocalStorage');
    service.testLocalStorage();
    expect(service.testLocalStorage).toHaveBeenCalled();
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should get, set, and remove the item
   *
   * @test
   */
  it('should get, set, and remove the item', () => {
    service.setItem('TEST', 'item');
    expect(service.getItem('TEST')).toBe('item');
    service.removeItem('TEST');
    expect(service.getItem('TEST')).toBe(null);
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should load initial state
   *
   * @test
   */
  it('should load initial state', () => {
    service.setItem('TEST.PROP', 'value');
    expect(LocalStorageService.loadInitialState()).toEqual({
      test: { prop: 'value' }
    });
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should load nested initial state
   *
   * @test
   */
  it('should load nested initial state', () => {
    service.setItem('TEST.PROP1.PROP2', 'value');
    expect(LocalStorageService.loadInitialState()).toEqual({
      test: { prop1: { prop2: 'value' } }
    });
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should load initial state with camel case property
   *
   * @test
   */
  it('should load initial state with camel case property', () => {
    service.setItem('TEST.SUB-PROP', 'value');
    expect(LocalStorageService.loadInitialState()).toEqual({
      test: { subProp: 'value' }
    });
  });

  /**
   * @Feature Local Storage
   * @Scenario Local Storage Service
   * @Case should load nested initial state with camel case properties
   *
   * @test
   */
  it('should load nested initial state with camel case properties', () => {
    service.setItem('TEST.SUB-PROP.SUB-SUB-PROP', 'value');
    expect(LocalStorageService.loadInitialState()).toEqual({
      test: { subProp: { subSubProp: 'value' } }
    });
  });
});
