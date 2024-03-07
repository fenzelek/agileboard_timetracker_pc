// import { ProjectCurrentStatus, ProjectStatus } from './projects.model';
// import {
//   checkStatus,
//   filterFeatures,
//   selectProjectsState,
//   sortArray,
//   sortFeaturesByDuration
// } from './projects.selectors';
// import { ProjectsState } from './projects.state';
//
// describe('Projects Selectors', () => {
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case selectProjectsState
//    *
//    * @test
//    */
//   it('selectProjectsState', () => {
//     const state = createProjectsState();
//     expect(selectProjectsState(state)).toBe(state.projects);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should sort features by DESC
//    *
//    * @test
//    */
//   it('should sort array by DESC', () => {
//     const newArray = sortArray(
//       [
//         {
//           id: 1,
//           content: 'Feature 3',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 88,
//           content: 'Feature 1',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 2,
//           content: 'Feature 2',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         }
//       ],
//       'DESC'
//     );
//     expect(newArray).toEqual([
//       {
//         id: 1,
//         content: 'Feature 3',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 2,
//         content: 'Feature 2',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 88,
//         content: 'Feature 1',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       }
//     ]);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should sort array by ASC
//    *
//    * @test
//    */
//   it('should sort array by ASC', () => {
//     const newArray = sortArray(
//       [
//         {
//           id: 1,
//           content: 'Feature 3',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 88,
//           content: 'Feature 1',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 2,
//           content: 'Feature 2',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 0,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         }
//       ],
//       'ASC'
//     );
//     expect(newArray).toEqual([
//       {
//         id: 88,
//         content: 'Feature 1',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 2,
//         content: 'Feature 2',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 1,
//         content: 'Feature 3',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 0,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       }
//     ]);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should sort array by tests duration
//    *
//    * @test
//    */
//   it('should sort array by tests duration', () => {
//     const newArray = sortFeaturesByDuration([
//       {
//         id: 1,
//         content: 'Feature 3',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 1000,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 88,
//         content: 'Feature 1',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 2000,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 2,
//         content: 'Feature 2',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 1,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       }
//     ]);
//     expect(newArray).toEqual([
//       {
//         id: 88,
//         content: 'Feature 1',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 2000,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 1,
//         content: 'Feature 3',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 1000,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       },
//       {
//         id: 2,
//         content: 'Feature 2',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 1,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       }
//     ]);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should filter return only 'Feature 1' item
//    *
//    * @test
//    */
//   it('should filter return only Feature 1 item', () => {
//     const newArray = filterFeatures(
//       [
//         {
//           id: 1,
//           content: 'Feature 3',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 1000,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 88,
//           content: 'Feature 1',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 2000,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         },
//         {
//           id: 2,
//           content: 'Feature 2',
//           project_id: 28,
//           last_tested: {
//             date: null,
//             duration: 1,
//             total: 1,
//             passed: 0,
//             failed: 0,
//             ignored: 0,
//             not_ran: 1
//           },
//           scenarios: []
//         }
//       ],
//       'Feature 1',
//       createProjectsState().projects
//     );
//
//     expect(newArray).toEqual([
//       {
//         id: 88,
//         content: 'Feature 1',
//         project_id: 28,
//         last_tested: {
//           date: null,
//           duration: 2000,
//           total: 1,
//           passed: 0,
//           failed: 0,
//           ignored: 0,
//           not_ran: 1
//         },
//         scenarios: []
//       }
//     ]);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should return true when status is DONE
//    *
//    * @test
//    */
//   it('should return true when status is DONE', () => {
//     const statusToCheck = {
//       type: 'ANALYZING',
//       status: 'DONE',
//       progress: 100,
//       message: 'Analyze has been done',
//       last_updated: '2021-05-26T08:27:32.596+0000'
//     } as ProjectCurrentStatus;
//     const cStatus = checkStatus(statusToCheck).isDone();
//     expect(cStatus).toEqual(true);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should return true when status is valid
//    *
//    * @test
//    */
//   it('should return true when status is valid', () => {
//     const statusToCheck = ({
//       type: 'EDITING',
//       status: 'PENDING',
//       progress: 50,
//       message: 'Pending has been started',
//       last_updated: '2021-05-26T08:27:32.596+0000'
//     } as unknown) as ProjectCurrentStatus;
//     const cStatus = checkStatus(statusToCheck).validStatus();
//     expect(cStatus).toEqual(true);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Selectors
//    * @Case should return false when status is invalid
//    *
//    * @test
//    */
//   it('should return false when status is invalid', () => {
//     const statusToCheck = ({
//       type: 'TEST_TYPE',
//       status: 'TEST_STATUS',
//       progress: 100,
//       message: 'test message',
//       last_updated: '2021-05-26T08:27:32.596+0000'
//     } as unknown) as ProjectCurrentStatus;
//     const cStatus = checkStatus(statusToCheck).validStatus();
//     expect(cStatus).toEqual(false);
//   });
// });
//
// function createProjectsState() {
//   return {
//     auth: {} as any,
//     companies: {} as any,
//     contractors: {} as any,
//     subscriptions: {} as any,
//     settings: {} as any,
//     router: {} as any,
//     projects: {
//       projects: {},
//       currentId: null,
//       currentStatus: {},
//       currentFeatures: {},
//       currentSuites: {},
//       currentUnmarked: {},
//       currentBranches: {},
//       currentChanges: {},
//       currentTestSourceCode: null,
//       filesSearched: [],
//       filesSelectedProject: {},
//       testValidateMethod: {},
//       lastTimeOfRememberToRefreshCode: 0,
//       sorting: {
//         features: 'ASC',
//         cases: 'ASC',
//         suites: 'ASC',
//         unmarked: 'ASC',
//         tests: 'ASC'
//       },
//       sortingByDuration: {
//         features: null,
//         cases: null,
//         suites: null,
//         unmarked: null,
//         tests: null
//       },
//       filters: {
//         features: null,
//         scenarios: false,
//         cases: null,
//         suites: null,
//         unmarked: null,
//         tests: null
//       }
//     } as ProjectsState,
//     features: {} as any,
//     users: {} as any
//   };
// }
