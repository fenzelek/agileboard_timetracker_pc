// import { authLogout } from './../auth/auth.actions';
// import { ProjectsState } from './projects.state';
// import { initialState, projectsReducer } from './projects.reducer';
// import { companiesSetCurrentCompany } from '../companies/companies.actions';
// import { Company } from '../companies/companies.model';
//
// describe('ProjectsReduce', () => {
//   const TEST_INITIAL_STATE: ProjectsState = {
//     projects: {
//       entities: {},
//       runnedTests: {
//         features: [],
//         scenarios: [],
//         cases: [],
//         suites: []
//       },
//       loaded: false,
//       loading: false
//     },
//     currentId: null,
//     currentStatus: {
//       status: null,
//       type: null,
//       progress: 0,
//       message: null
//     },
//     currentFeatures: {
//       features: [],
//       loading: false,
//       loaded: false
//     },
//     currentSuites: {
//       suites: [],
//       loading: false,
//       loaded: false
//     },
//     currentUnmarked: {
//       unmarked: [],
//       pagination: {
//         current_page: 1,
//         per_page: 50
//       },
//       loading: false,
//       loaded: false
//     },
//     currentBranches: {
//       branches: null,
//       loading: false,
//       loaded: false
//     },
//     currentChanges: {
//       features: {},
//       scenarios: {},
//       cases: {},
//       suites: {},
//       tests: {}
//     },
//     currentProjectCountTags: {
//       features: 0,
//       cases: 0,
//       suites: 0,
//       suites_tests: 0,
//       unmarked: 0,
//       tests: 0
//     },
//     currentTestSourceCode: '',
//     filesSearched: [],
//     filesSelectedProject: {
//       files: [],
//       testFiles: [],
//       loading: false,
//       loaded: false
//     },
//     testValidateMethod: {
//       valid: false,
//       error: null,
//       loading: false,
//       loaded: false
//     },
//     lastTimeOfRememberToRefreshCode: 0,
//     sorting: {
//       features: 'ASC',
//       cases: 'ASC',
//       suites: 'ASC',
//       unmarked: 'ASC',
//       tests: 'ASC'
//     },
//     sortingByDuration: {
//       features: null,
//       cases: null,
//       suites: null,
//       unmarked: null,
//       tests: null
//     },
//     filters: {
//       features: null,
//       scenarios: false,
//       cases: null,
//       suites: null,
//       tests: null,
//       unmarked: null
//     },
//     collapseHeader: false,
//     collapseGroups: {
//       features: false,
//       cases: false,
//       tests: false
//     }
//   };
//
//   const testCompany: Company = {
//     id: 1,
//     name: 'Test Company',
//     email: 'user@user.com',
//     phone: '123456789',
//     website: 'http://localhost',
//     tax_country: 'PL',
//     tax_enum: 'eu_vat',
//     tax: 'PL1234567890',
//     main_address_line_1: 'aa',
//     main_address_line_2: 'bb',
//     main_zip_code: '12-345',
//     main_country: 'PL',
//     main_city: 'Poznań',
//     main_state: 'Wielkopolska',
//     logo: '/assets/images/defaultLogo.png',
//     contractors: [],
//     is_company: true,
//     is_configured: true,
//     is_payed: true
//   };
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Reducer
//    * @Case should return default state
//    *
//    * @test
//    */
//   it('should return default state', () => {
//     const action = {} as any;
//     const state = projectsReducer(undefined, action);
//
//     expect(state).toBe(initialState);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Reducer
//    * @Case should set to initial state on auth logout
//    *
//    * @test
//    */
//   it('should set to initial state on auth logout', () => {
//     const action = authLogout();
//     const state = projectsReducer(TEST_INITIAL_STATE, action);
//
//     expect(state).toBe(initialState);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Reducer
//    * @Case should set to initial state on auth logout
//    *
//    * @test
//    */
//   it('should set to initial state on auth logout', () => {
//     const action = companiesSetCurrentCompany({
//       company: testCompany
//     });
//     const state = projectsReducer(TEST_INITIAL_STATE, action);
//
//     expect(state.projects).toEqual(TEST_INITIAL_STATE.projects);
//   });
// });
