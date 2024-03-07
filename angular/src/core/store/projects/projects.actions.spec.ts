// import {
//   projectsAddF,
//   projectsAddR,
//   projectsAddS,
//   projectsAnalyzeF,
//   projectsAnalyzeR,
//   projectsAnalyzeS,
//   projectsApplyChangesF,
//   projectsApplyChangesR,
//   projectsApplyChangesS,
//   projectsBranchesF,
//   projectsBranchesR,
//   projectsBranchesS,
//   projectsCasesF,
//   projectsCasesR,
//   projectsCasesS,
//   projectsChangeCase,
//   projectsChangeFeature,
//   projectsChangeScenario,
//   projectsChangeSort,
//   projectsChangeSortByDuration,
//   projectsChangeSuite,
//   projectsChangeTest,
//   projectsCloneRepositoryF,
//   projectsCloneRepositoryR,
//   projectsCloneRepositoryS,
//   projectsCreateEnvironmentF,
//   projectsCreateEnvironmentR,
//   projectsCreateEnvironmentS,
//   projectsDeleteF,
//   projectsDeleteR,
//   projectsDeleteS,
//   projectsEditF,
//   projectsEditR,
//   projectsEditS,
//   projectsEntitiesF,
//   projectsEntitiesR,
//   projectsEntitiesS,
//   projectsEnvironmentsF,
//   projectsEnvironmentsR,
//   projectsEnvironmentsS,
//   projectsFeaturesF,
//   projectsFeaturesR,
//   projectsFeaturesS,
//   projectsFilesF,
//   projectsFilesR,
//   projectsFilesS,
//   projectsForceDeleteF,
//   projectsForceDeleteR,
//   projectsForceDeleteS,
//   projectsFscF,
//   projectsFscR,
//   projectsFscS,
//   projectsGetLastTimeOfRememberToRefreshCode,
//   projectsLockF,
//   projectsLockR,
//   projectsLockS,
//   projectsRefreshF,
//   projectsRefreshR,
//   projectsRefreshS,
//   projectsResetLocalStorage,
//   projectsRunTestsF,
//   projectsRunTestsR,
//   projectsRunTestsS,
//   projectsScenariosF,
//   projectsScenariosR,
//   projectsScenariosS,
//   projectsSearchFilesR,
//   projectsSearchFilesS,
//   projectsSetCasesFilter,
//   projectsSetCurrent,
//   projectsSetFeaturesFilter,
//   projectsSetFilesF,
//   projectsSetFilesR,
//   projectsSetFilesS,
//   projectsSetLastTimeOfRememberToRefreshCode,
//   projectsSetSuitesFilter,
//   projectsSetTestsFilter,
//   projectsSetUnmarkedFilter,
//   projectsStatusF,
//   projectsStatusR,
//   projectsStatusS,
//   projectsSuitesF,
//   projectsSuitesR,
//   projectsSuitesS,
//   projectsSuiteTestsF,
//   projectsSuiteTestsR,
//   projectsSuiteTestsS,
//   projectsTestAddF,
//   projectsTestAddR,
//   projectsTestAddS,
//   projectsTestsF,
//   projectsTestSourceCodeClear,
//   projectsTestSourceCodeF,
//   projectsTestSourceCodeR,
//   projectsTestSourceCodeS,
//   projectsTestsR,
//   projectsTestsS,
//   projectsTestValidateMethodF,
//   projectsTestValidateMethodR,
//   projectsTestValidateMethodReset,
//   projectsTestValidateMethodS,
//   projectsUnlockF,
//   projectsUnlockR,
//   projectsUnlockS,
//   projectsUnmarkedTestsF,
//   projectsUnmarkedTestsNextF,
//   projectsUnmarkedTestsNextR,
//   projectsUnmarkedTestsNextS,
//   projectsUnmarkedTestsR,
//   projectsUnmarkedTestsS,
//   projectsUpdateBranchF,
//   projectsUpdateBranchR,
//   projectsUpdateBranchS,
//   projectsUpdateEnvironmentF,
//   projectsUpdateEnvironmentR,
//   projectsUpdateEnvironmentS
// } from './projects.actions';
// import {
//   ProjectAuthType,
//   ProjectEnvironmentAuthType,
//   ProjectStatus,
//   ProjectStatusType,
//   ProjectTestStatus
// } from './projects.model';
//
// describe('Projects Actions', () => {
//   const testProject = {
//     id: 1,
//     name: 'Test Project',
//     language: 'PHP',
//
//     authorisation_type: ProjectAuthType.USERNAME_PASSWORD,
//
//     repository_url: '',
//     repository_ssh_url: '',
//     repository_hash: '',
//     repository_password: '',
//     repository_username: '',
//     repository_ssh_private_key: '',
//     repository_ssh_private_pass: '',
//
//     testing_branch: 'master',
//
//     validated_credentials: true,
//     validated_branch: true,
//     cloned_repository: true,
//     validated_environment: false,
//
//     analyzed_repository: true,
//     analyzed_at: '',
//     analyzed_status: ProjectStatus.DONE
//   };
//
//   const testBranch = {
//     project_id: 1,
//     name: 'Test Branch',
//     is_origin: true
//   };
//
//   const testFile = {
//     name: 'Test File',
//     path: '/test/file.php',
//     expandable: false,
//     sizeL: 2,
//     isSelected: false,
//     isDirectory: false,
//     level: 0
//   };
//
//   const projectTestFile = {
//     id: 1,
//     name: 'file.php',
//     path: '/test/file.php'
//   };
//
//   const testProjectStatus = {
//     status: ProjectStatus.DONE,
//     type: ProjectStatusType.TESTING,
//     message: 'Test Message',
//     progress: 100
//   };
//
//   const testProjectLastTested = {
//     date: Date.now().toString(),
//     duration: 0,
//     failed: 0,
//     ignored: 0,
//     not_ran: 0,
//     passed: 0,
//     total: 0
//   };
//
//   const testProjectTests = [
//     {
//       id: 1,
//       expectation: '',
//       function_arguments: '($var)',
//       function_name: 'test_function',
//       function_type: 'PHP',
//       raw_annotations: '',
//       seed: '',
//       unmarked: false,
//       template: false,
//       start_line: 20,
//       testing_results: [
//         {
//           id: 1,
//           duration: 1,
//           message: 'test',
//           status: ProjectTestStatus.SUCCESS,
//           updated_at: 'test'
//         }
//       ],
//       file: projectTestFile
//     }
//   ];
//
//   const testProjectCases = [
//     {
//       id: 1,
//       content: 'content case',
//       scenario_id: 1,
//       last_tested: testProjectLastTested,
//       tests: testProjectTests
//     }
//   ];
//
//   const testProjectScenarios = [
//     {
//       id: 1,
//       content: 'content scenario',
//       feature_id: 1,
//       last_tested: testProjectLastTested,
//       cases: testProjectCases
//     }
//   ];
//
//   const testProjectFeatures = [
//     {
//       id: 1,
//       content: 'content feature',
//       project_id: 1,
//       last_tested: testProjectLastTested,
//       scenarios: testProjectScenarios
//     }
//   ];
//
//   const testProjectCreateTest = {
//     function_name: 'function_name',
//     fsc: [],
//     file_id: 1,
//     suites: [],
//     expectation: 'test',
//     seed: 'test'
//   };
//
//   const testProjectSuites = [
//     {
//       id: 1,
//       content: 'test suite',
//       last_tested: testProjectLastTested,
//       tests: testProjectTests
//     }
//   ];
//
//   const testProjectUnmarkedPagination = {
//     current_page: 1,
//     per_page: 10,
//     last_page: 1,
//     total: 1,
//     from: 1,
//     to: 1,
//     path: 'path'
//   };
//
//   const testProjectEnvironment = {
//     id: 1,
//     name: 'Test Environment',
//     user_name: 'Test',
//     password: 'secret',
//     connection_ip: '127.0.0.1',
//     port: 22,
//     max_expected_min: 5,
//     ssh_private_key_pass: null,
//     ssh_private_key: null,
//     root_path: '/root',
//     test_path_run: '/home/project/tests',
//     authorisation_type: ProjectEnvironmentAuthType.USERNAME_PASSWORD,
//     updated_at: Date.now().toString(),
//     validated_environment: true
//   };
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsResetLocalStorage action
//    *
//    * @test
//    */
//   it('should create projectsResetLocalStorage action', () => {
//     const action = projectsResetLocalStorage();
//     expect(action.type).toEqual('[Projects] Reset Local Storage');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEntitiesR action
//    *
//    * @test
//    */
//   it('should create projectsEntitiesR action', () => {
//     const action = projectsEntitiesR();
//     expect(action.type).toEqual('[Projects] Entities - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEntitiesS action
//    *
//    * @test
//    */
//   it('should create projectsEntitiesS action', () => {
//     const data = [testProject];
//     const action = projectsEntitiesS({ data });
//     expect(action.type).toEqual('[Projects] Entities - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEntitiesF action
//    *
//    * @test
//    */
//   it('should create projectsEntitiesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsEntitiesF({ error });
//     expect(action.type).toEqual('[Projects] Entities - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetCurrent action
//    *
//    * @test
//    */
//   it('should create projectsSetCurrent action', () => {
//     const id = 1;
//     const action = projectsSetCurrent({ id });
//     expect(action.type).toEqual('[Projects] Set current id');
//     expect(action.id).toEqual(id);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAddR action
//    *
//    * @test
//    */
//   it('should create projectsAddR action', () => {
//     const data = testProject;
//     const action = projectsAddR({ data });
//     expect(action.type).toEqual('[Projects] Create new project - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAddS action
//    *
//    * @test
//    */
//   it('should create projectsAddS action', () => {
//     const data = testProject;
//     const action = projectsAddS({ data });
//     expect(action.type).toEqual('[Projects] Create new project - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAddF action
//    *
//    * @test
//    */
//   it('should create projectsAddF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsAddF({ error });
//     expect(action.type).toEqual('[Projects] Create new project - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEditR action
//    *
//    * @test
//    */
//   it('should create projectsEditR action', () => {
//     const data = testProject;
//     const action = projectsEditR({ data });
//     expect(action.type).toEqual('[Projects] Edit project - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEditS action
//    *
//    * @test
//    */
//   it('should create projectsEditS action', () => {
//     const data = testProject;
//     const action = projectsEditS({ data });
//     expect(action.type).toEqual('[Projects] Edit project - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEditF action
//    *
//    * @test
//    */
//   it('should create projectsEditF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsEditF({ error });
//     expect(action.type).toEqual('[Projects] Edit project - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsDeleteR action
//    *
//    * @test
//    */
//   it('should create projectsDeleteR action', () => {
//     const data = 1;
//     const action = projectsDeleteR({ data });
//     expect(action.type).toEqual('[Projects] Delete project - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsDeleteS action
//    *
//    * @test
//    */
//   it('should create projectsDeleteS action', () => {
//     const data = 1;
//     const action = projectsDeleteS({ data });
//     expect(action.type).toEqual('[Projects] Delete project - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsDeleteF action
//    *
//    * @test
//    */
//   it('should create projectsDeleteF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const currentProjectId = 1;
//     const action = projectsDeleteF({ error, currentProjectId });
//     expect(action.type).toEqual('[Projects] Delete project - Fail');
//     expect(action.error).toEqual(error);
//     expect(action.currentProjectId).toEqual(currentProjectId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsForceDeleteR action
//    *
//    * @test
//    */
//   it('should create projectsForceDeleteR action', () => {
//     const project_id = 1;
//     const action = projectsForceDeleteR({ project_id });
//     expect(action.type).toEqual('[Projects] Force delete project - Request');
//     expect(action.project_id).toEqual(project_id);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsForceDeleteS action
//    *
//    * @test
//    */
//   it('should create projectsForceDeleteS action', () => {
//     const projectId = 1;
//     const action = projectsForceDeleteS({ projectId });
//     expect(action.type).toEqual('[Projects] Force delete project - Success');
//     expect(action.projectId).toEqual(1);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsForceDeleteF action
//    *
//    * @test
//    */
//   it('should create projectsForceDeleteF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const projectId = 1;
//     const action = projectsForceDeleteF({ error, projectId });
//     expect(action.type).toEqual('[Projects] Force delete project - Fail');
//     expect(action.error).toEqual(error);
//     expect(action.projectId).toEqual(1);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsBranchesR action
//    *
//    * @test
//    */
//   it('should create projectsBranchesR action', () => {
//     const action = projectsBranchesR();
//     expect(action.type).toEqual('[Projects] Project branches - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsBranchesS action
//    *
//    * @test
//    */
//   it('should create projectsBranchesS action', () => {
//     const data = [testBranch];
//     const action = projectsBranchesS({ data });
//     expect(action.type).toEqual('[Projects] Project branches - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsBranchesF action
//    *
//    * @test
//    */
//   it('should create projectsBranchesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsBranchesF({ error });
//     expect(action.type).toEqual('[Projects] Project branches - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUpdateBranchR action
//    *
//    * @test
//    */
//   it('should create projectsUpdateBranchR action', () => {
//     const data = 'Test Branch';
//     const action = projectsUpdateBranchR({ data });
//     expect(action.type).toEqual('[Projects] Project update branch - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUpdateBranchS action
//    *
//    * @test
//    */
//   it('should create projectsUpdateBranchS action', () => {
//     const data = testProject;
//     const action = projectsUpdateBranchS({ data });
//     expect(action.type).toEqual('[Projects] Project update branch - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUpdateBranchF action
//    *
//    * @test
//    */
//   it('should create projectsUpdateBranchF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsUpdateBranchF({ error });
//     expect(action.type).toEqual('[Projects] Project update branch - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFilesR action
//    *
//    * @test
//    */
//   it('should create projectsFilesR action', () => {
//     const action = projectsFilesR();
//     expect(action.type).toEqual('[Projects] Project files - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFilesS action
//    *
//    * @test
//    */
//   it('should create projectsFilesS action', () => {
//     const data = [testFile];
//     const action = projectsFilesS({ data });
//     expect(action.type).toEqual('[Projects] Project files - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFilesF action
//    *
//    * @test
//    */
//   it('should create projectsFilesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsFilesF({ error });
//     expect(action.type).toEqual('[Projects] Delete project - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSearchFilesR action
//    *
//    * @test
//    */
//   it('should create projectsSearchFilesR action', () => {
//     const data = {
//       path: 'test'
//     };
//     const action = projectsSearchFilesR({ data });
//     expect(action.type).toEqual('[Projects] Project search files - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSearchFilesS action
//    *
//    * @test
//    */
//   it('should create projectsSearchFilesS action', () => {
//     const data = [projectTestFile];
//     const action = projectsSearchFilesS({ data });
//     expect(action.type).toEqual('[Projects] Project search files - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetFilesR action
//    *
//    * @test
//    */
//   it('should create projectsSetFilesR action', () => {
//     const data = ['test1', 'test2'];
//     const action = projectsSetFilesR({ data });
//     expect(action.type).toEqual('[Projects] Project set files - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetFilesS action
//    *
//    * @test
//    */
//   it('should create projectsSetFilesS action', () => {
//     const data = ['test1', 'test2'];
//     const action = projectsSetFilesS({ data });
//     expect(action.type).toEqual('[Projects] Project set files - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetFilesF action
//    *
//    * @test
//    */
//   it('should create projectsSetFilesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsSetFilesF({ error });
//     expect(action.type).toEqual('[Projects] Project set files - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsStatusR action
//    *
//    * @test
//    */
//   it('should create projectsStatusR action', () => {
//     const action = projectsStatusR();
//     expect(action.type).toEqual('[Projects] Project refresh state - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsStatusS action
//    *
//    * @test
//    */
//   it('should create projectsStatusS action', () => {
//     const data = testProjectStatus;
//     const action = projectsStatusS({ data });
//     expect(action.type).toEqual('[Projects] Project refresh state - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsStatusF action
//    *
//    * @test
//    */
//   it('should create projectsStatusF action', () => {
//     const data = {
//       error: 'Error'
//     };
//     const action = projectsStatusF({ data });
//     expect(action.type).toEqual('[Projects] Project refresh state - Fail');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRefreshR action
//    *
//    * @test
//    */
//   it('should create projectsRefreshR action', () => {
//     const action = projectsRefreshR();
//     expect(action.type).toEqual('[Projects] Project refresh - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRefreshS action
//    *
//    * @test
//    */
//   it('should create projectsRefreshS action', () => {
//     const data = testProjectStatus;
//     const action = projectsRefreshS({ data });
//     expect(action.type).toEqual('[Projects] Project refresh - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRefreshF action
//    *
//    * @test
//    */
//   it('should create projectsRefreshF action', () => {
//     const data = {
//       error: 'Error'
//     };
//     const action = projectsRefreshF({ data });
//     expect(action.type).toEqual('[Projects] Project refresh - Fail');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCloneRepositoryR action
//    *
//    * @test
//    */
//   it('should create projectsCloneRepositoryR action', () => {
//     const action = projectsCloneRepositoryR();
//     expect(action.type).toEqual(
//       '[Projects] Project clone repository - Request'
//     );
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCloneRepositoryS action
//    *
//    * @test
//    */
//   it('should create projectsCloneRepositoryS action', () => {
//     const data = testProjectStatus;
//     const action = projectsCloneRepositoryS({ data });
//     expect(action.type).toEqual(
//       '[Projects] Project clone repository - Success'
//     );
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCloneRepositoryF action
//    *
//    * @test
//    */
//   it('should create projectsCloneRepositoryF action', () => {
//     const data = {
//       error: 'Error'
//     };
//     const action = projectsCloneRepositoryF({ data });
//     expect(action.type).toEqual('[Projects] Project clone repository - Fail');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAnalyzeR action
//    *
//    * @test
//    */
//   it('should create projectsAnalyzeR action', () => {
//     const force = false;
//     const action = projectsAnalyzeR({ force });
//     expect(action.type).toEqual('[Projects] Project analyze - Request');
//     expect(action.force).toEqual(force);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAnalyzeS action
//    *
//    * @test
//    */
//   it('should create projectsAnalyzeS action', () => {
//     const data = testProjectStatus;
//     const action = projectsAnalyzeS({ data });
//     expect(action.type).toEqual('[Projects] Project analyze - Success');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsAnalyzeF action
//    *
//    * @test
//    */
//   it('should create projectsAnalyzeF action', () => {
//     const data = {
//       error: 'Error'
//     };
//     const action = projectsAnalyzeF({ data });
//     expect(action.type).toEqual('[Projects] Project analyze - Fail');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFeaturesR action
//    *
//    * @test
//    */
//   it('should create projectsFeaturesR action', () => {
//     const action = projectsFeaturesR();
//     expect(action.type).toEqual('[Projects] Project features - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFeaturesS action
//    *
//    * @test
//    */
//   it('should create projectsFeaturesS action', () => {
//     const data = testProjectFeatures;
//     const action = projectsFeaturesS({ data });
//     expect(action.type).toEqual('[Projects] Project features - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFeaturesF action
//    *
//    * @test
//    */
//   it('should create projectsFeaturesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsFeaturesF({ error });
//     expect(action.type).toEqual('[Projects] Project features - Fail');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsScenariosR action
//    *
//    * @test
//    */
//   it('should create projectsScenariosR action', () => {
//     const featureId = 1;
//     const action = projectsScenariosR({ featureId });
//     expect(action.type).toEqual('[Projects] Project scenarios - Request');
//     expect(action.featureId).toEqual(featureId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsScenariosS action
//    *
//    * @test
//    */
//   it('should create projectsScenariosS action', () => {
//     const featureId = 1;
//     const data = testProjectScenarios;
//     const action = projectsScenariosS({ featureId, data });
//     expect(action.type).toEqual('[Projects] Project scenarios - Success');
//     expect(action.featureId).toEqual(featureId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsScenariosF action
//    *
//    * @test
//    */
//   it('should create projectsScenariosF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsScenariosF({ error });
//     expect(action.type).toEqual('[Projects] Project scenarios - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCasesR action
//    *
//    * @test
//    */
//   it('should create projectsCasesR action', () => {
//     const scenarioId = 1;
//     const action = projectsCasesR({ scenarioId });
//     expect(action.type).toEqual('[Projects] Project cases - Request');
//     expect(action.scenarioId).toEqual(scenarioId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCasesS action
//    *
//    * @test
//    */
//   it('should create projectsCasesS action', () => {
//     const scenarioId = 1;
//     const data = testProjectCases;
//     const action = projectsCasesS({ scenarioId, data });
//     expect(action.type).toEqual('[Projects] Project cases - Success');
//     expect(action.scenarioId).toEqual(scenarioId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCasesF action
//    *
//    * @test
//    */
//   it('should create projectsCasesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsCasesF({ error });
//     expect(action.type).toEqual('[Projects] Project cases - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestsR action
//    *
//    * @test
//    */
//   it('should create projectsTestsR action', () => {
//     const featureId = 1;
//     const scenarioId = 1;
//     const caseId = 1;
//     const action = projectsTestsR({ featureId, scenarioId, caseId });
//     expect(action.type).toEqual('[Projects] Project tests - Request');
//     expect(action.featureId).toEqual(featureId);
//     expect(action.scenarioId).toEqual(scenarioId);
//     expect(action.caseId).toEqual(caseId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestsS action
//    *
//    * @test
//    */
//   it('should create projectsTestsS action', () => {
//     const caseId = 1;
//     const data = testProjectTests;
//     const action = projectsTestsS({ caseId, data });
//     expect(action.type).toEqual('[Projects] Project tests - Success');
//     expect(action.caseId).toEqual(caseId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestsF action
//    *
//    * @test
//    */
//   it('should create projectsTestsF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsTestsF({ error });
//     expect(action.type).toEqual('[Projects] Project tests - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestAddR action
//    *
//    * @test
//    */
//   it('should create projectsTestAddR action', () => {
//     const data = testProjectCreateTest;
//     const action = projectsTestAddR({ data });
//     expect(action.type).toEqual('[Projects] Project test add - Request');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestAddS action
//    *
//    * @test
//    */
//   it('should create projectsTestAddS action', () => {
//     const action = projectsTestAddS();
//     expect(action.type).toEqual('[Projects] Project test add - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestAddF action
//    *
//    * @test
//    */
//   it('should create projectsTestAddF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsTestAddF({ error });
//     expect(action.type).toEqual('[Projects] Project test add - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestValidateMethodReset action
//    *
//    * @test
//    */
//   it('should create projectsTestValidateMethodReset action', () => {
//     const action = projectsTestValidateMethodReset();
//     expect(action.type).toEqual(
//       '[Projects] Project test validate method reset'
//     );
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestValidateMethodR action
//    *
//    * @test
//    */
//   it('should create projectsTestValidateMethodR action', () => {
//     const method = 'test_method';
//     const file_id = 1;
//     const action = projectsTestValidateMethodR({ method, file_id });
//     expect(action.type).toEqual(
//       '[Projects] Project test validate method - Request'
//     );
//     expect(action.method).toEqual(method);
//     expect(action.file_id).toEqual(file_id);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestValidateMethodS action
//    *
//    * @test
//    */
//   it('should create projectsTestValidateMethodS action', () => {
//     const message = 'Success';
//     const action = projectsTestValidateMethodS({ message });
//     expect(action.type).toEqual(
//       '[Projects] Project test validate method - Success'
//     );
//     expect(action.message).toEqual(message);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestValidateMethodF action
//    *
//    * @test
//    */
//   it('should create projectsTestValidateMethodF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsTestValidateMethodF({ error });
//     expect(action.type).toEqual(
//       '[Projects] Project test validate method - Fail'
//     );
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFscR action
//    *
//    * @test
//    */
//   it('should create projectsFscR action', () => {
//     const action = projectsFscR();
//     expect(action.type).toEqual('[Projects] Project FSC - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFscS action
//    *
//    * @test
//    */
//   it('should create projectsFscS action', () => {
//     const data = testProjectFeatures;
//     const action = projectsFscS({ data });
//     expect(action.type).toEqual('[Projects] Project FSC - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsFscF action
//    *
//    * @test
//    */
//   it('should create projectsFscF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsFscF({ error });
//     expect(action.type).toEqual('[Projects] Project FSC - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuitesR action
//    *
//    * @test
//    */
//   it('should create projectsSuitesR action', () => {
//     const action = projectsSuitesR();
//     expect(action.type).toEqual('[Projects] Project suites - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuitesS action
//    *
//    * @test
//    */
//   it('should create projectsSuitesS action', () => {
//     const data = testProjectSuites;
//     const action = projectsSuitesS({ data });
//     expect(action.type).toEqual('[Projects] Project suites - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuitesF action
//    *
//    * @test
//    */
//   it('should create projectsSuitesF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsSuitesF({ error });
//     expect(action.type).toEqual('[Projects] Project suites - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuiteTestsR action
//    *
//    * @test
//    */
//   it('should create projectsSuiteTestsR action', () => {
//     const suiteId = 1;
//     const action = projectsSuiteTestsR({ suiteId });
//     expect(action.type).toEqual('[Projects] Project suite tests - Request');
//     expect(action.suiteId).toEqual(suiteId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuiteTestsS action
//    *
//    * @test
//    */
//   it('should create projectsSuiteTestsS action', () => {
//     const suiteId = 1;
//     const data = testProjectTests;
//     const action = projectsSuiteTestsS({ suiteId, data });
//     expect(action.type).toEqual('[Projects] Project suite tests - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSuiteTestsF action
//    *
//    * @test
//    */
//   it('should create projectsSuiteTestsF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsSuiteTestsF({ error });
//     expect(action.type).toEqual('[Projects] Project suite tests - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsR action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsR action', () => {
//     const suiteId = 1;
//     const action = projectsUnmarkedTestsR();
//     expect(action.type).toEqual('[Projects] Project unmarked tests - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsS action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsS action', () => {
//     const data = testProjectTests;
//     const meta = testProjectUnmarkedPagination;
//     const action = projectsUnmarkedTestsS({ data, meta });
//     expect(action.type).toEqual('[Projects] Project unmarked tests - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsF action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsUnmarkedTestsF({ error });
//     expect(action.type).toEqual('[Projects] Project unmarked tests - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsNextR action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsNextR action', () => {
//     const action = projectsUnmarkedTestsNextR();
//     expect(action.type).toEqual(
//       '[Projects] Project unmarked tests next page - Request'
//     );
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsNextS action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsNextS action', () => {
//     const data = testProjectTests;
//     const meta = testProjectUnmarkedPagination;
//     const action = projectsUnmarkedTestsNextS({ data, meta });
//     expect(action.type).toEqual(
//       '[Projects] Project unmarked tests next page - Success'
//     );
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnmarkedTestsNextF action
//    *
//    * @test
//    */
//   it('should create projectsUnmarkedTestsNextF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsUnmarkedTestsNextF({ error });
//     expect(action.type).toEqual(
//       '[Projects] Project unmarked tests next page - Fail'
//     );
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEnvironmentsR action
//    *
//    * @test
//    */
//   it('should create projectsEnvironmentsR action', () => {
//     const projectId = 1;
//     const action = projectsEnvironmentsR({ projectId });
//     expect(action.type).toEqual('[Projects] Project environments - Request');
//     expect(action.projectId).toEqual(projectId);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEnvironmentsS action
//    *
//    * @test
//    */
//   it('should create projectsEnvironmentsS action', () => {
//     const projectId = 1;
//     const data = [testProjectEnvironment];
//     const action = projectsEnvironmentsS({ projectId, data });
//     expect(action.type).toEqual('[Projects] Project environments - Success');
//     expect(action.projectId).toEqual(projectId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsEnvironmentsF action
//    *
//    * @test
//    */
//   it('should create projectsEnvironmentsF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsEnvironmentsF({ error });
//     expect(action.type).toEqual('[Projects] Project environments - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCreateEnvironmentR action
//    *
//    * @test
//    */
//   it('should create projectsCreateEnvironmentR action', () => {
//     const data = testProjectEnvironment;
//     const action = projectsCreateEnvironmentR({ data });
//     expect(action.type).toEqual(
//       '[Projects] Project create environment - Request'
//     );
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCreateEnvironmentS action
//    *
//    * @test
//    */
//   it('should create projectsCreateEnvironmentS action', () => {
//     const projectId = 1;
//     const data = testProjectEnvironment;
//     const action = projectsCreateEnvironmentS({ projectId, data });
//     expect(action.type).toEqual(
//       '[Projects] Project create environment - Success'
//     );
//     expect(action.projectId).toEqual(projectId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCreateEnvironmentF action
//    *
//    * @test
//    */
//   it('should create projectsCreateEnvironmentF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsCreateEnvironmentF({ error });
//     expect(action.type).toEqual('[Projects] Project create environment - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsCreateEnvironmentR action
//    *
//    * @test
//    */
//   it('should create projectsCreateEnvironmentR action', () => {
//     const data = testProjectEnvironment;
//     const action = projectsUpdateEnvironmentR({ data });
//     expect(action.type).toEqual(
//       '[Projects] Project update environment - Request'
//     );
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUpdateEnvironmentS action
//    *
//    * @test
//    */
//   it('should create projectsUpdateEnvironmentS action', () => {
//     const projectId = 1;
//     const data = testProjectEnvironment;
//     const action = projectsUpdateEnvironmentS({ projectId, data });
//     expect(action.type).toEqual(
//       '[Projects] Project update environment - Success'
//     );
//     expect(action.projectId).toEqual(projectId);
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUpdateEnvironmentF action
//    *
//    * @test
//    */
//   it('should create projectsUpdateEnvironmentF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsUpdateEnvironmentF({ error });
//     expect(action.type).toEqual('[Projects] Project update environment - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRunTestsR action
//    *
//    * @test
//    */
//   it('should create projectsRunTestsR action', () => {
//     const group = 'features';
//     const ids = [1, 2, 3];
//     const action = projectsRunTestsR({ group, ids });
//     expect(action.type).toEqual('[Projects] Project run tests - Request');
//     expect(action.group).toEqual(group);
//     expect(action.ids).toEqual(ids);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRunTestsS action
//    *
//    * @test
//    */
//   it('should create projectsRunTestsS action', () => {
//     const action = projectsRunTestsS({ group: 'features', ids: [1] });
//     expect(action.type).toEqual('[Projects] Project run tests - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsRunTestsF action
//    *
//    * @test
//    */
//   it('should create projectsRunTestsF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsRunTestsF({ error, projectId: 1 });
//     expect(action.type).toEqual('[Projects] Project run tests - Fail');
//     expect(action.error).toEqual(error);
//     expect(action.projectId).toEqual(1);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestSourceCodeR action
//    *
//    * @test
//    */
//   it('should create projectsTestSourceCodeR action', () => {
//     const file_id = 1;
//     const action = projectsTestSourceCodeR({ file_id });
//     expect(action.type).toEqual(
//       '[Projects] Project test source code - Request'
//     );
//     expect(action.file_id).toEqual(file_id);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestSourceCodeS action
//    *
//    * @test
//    */
//   it('should create projectsTestSourceCodeS action', () => {
//     const source_code = 'source code';
//     const action = projectsTestSourceCodeS({ source_code });
//     expect(action.type).toEqual(
//       '[Projects] Project test source code - Success'
//     );
//     expect(action.source_code).toEqual(source_code);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestSourceCodeF action
//    *
//    * @test
//    */
//   it('should create projectsTestSourceCodeF action', () => {
//     const error = {
//       message: 'Error'
//     };
//     const action = projectsTestSourceCodeF({ error });
//     expect(action.type).toEqual('[Projects] Project test source code - Fail');
//     expect(action.error).toEqual(error);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsTestSourceCodeClear action
//    *
//    * @test
//    */
//   it('should create projectsTestSourceCodeClear action', () => {
//     const file_id = 1;
//     const action = projectsTestSourceCodeClear();
//     expect(action.type).toEqual('[Projects] Project test source code clear');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeFeature action
//    *
//    * @test
//    */
//   it('should create projectsChangeFeature action', () => {
//     const data = {
//       id: 1,
//       content: 'test feature changed'
//     };
//     const action = projectsChangeFeature({ data });
//     expect(action.type).toEqual('[Projects] Project change feature');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeScenario action
//    *
//    * @test
//    */
//   it('should create projectsChangeScenario action', () => {
//     const data = {
//       id: 1,
//       content: 'test scenario changed',
//       feature_id: 1
//     };
//     const action = projectsChangeScenario({ data });
//     expect(action.type).toEqual('[Projects] Project change scenario');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeCase action
//    *
//    * @test
//    */
//   it('should create projectsChangeCase action', () => {
//     const data = {
//       id: 1,
//       content: 'test case changed',
//       scenario_id: 1
//     };
//     const action = projectsChangeCase({ data });
//     expect(action.type).toEqual('[Projects] Project change case');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeSuite action
//    *
//    * @test
//    */
//   it('should create projectsChangeSuite action', () => {
//     const data = {
//       id: 1,
//       content: 'test suite changed'
//     };
//     const action = projectsChangeSuite({ data });
//     expect(action.type).toEqual('[Projects] Project change suite');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeTest action
//    *
//    * @test
//    */
//   it('should create projectsChangeTest action', () => {
//     const data = {
//       id: 1,
//       raw_annotations: 'raw',
//       function_name: 'test_function_changed'
//     };
//     const action = projectsChangeTest({ data });
//     expect(action.type).toEqual('[Projects] Project change test');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsApplyChangesR action
//    *
//    * @test
//    */
//   it('should create projectsApplyChangesR action', () => {
//     const action = projectsApplyChangesR();
//     expect(action.type).toEqual('[Projects] Project apply changes - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsApplyChangesS action
//    *
//    * @test
//    */
//   it('should create projectsApplyChangesS action', () => {
//     const data = testProjectStatus;
//     const action = projectsApplyChangesS({ data });
//     expect(action.type).toEqual('[Projects] Project apply changes - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsApplyChangesF action
//    *
//    * @test
//    */
//   it('should create projectsApplyChangesF action', () => {
//     const action = projectsApplyChangesF();
//     expect(action.type).toEqual('[Projects] Project apply changes - Fail');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsLockR action
//    *
//    * @test
//    */
//   it('should create projectsLockR action', () => {
//     const action = projectsLockR();
//     expect(action.type).toEqual('[Projects] Project lock - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsLockS action
//    *
//    * @test
//    */
//   it('should create projectsLockS action', () => {
//     const data = testProjectStatus;
//     const action = projectsLockS({ data });
//     expect(action.type).toEqual('[Projects] Project lock - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsLockF action
//    *
//    * @test
//    */
//   it('should create projectsLockF action', () => {
//     const action = projectsLockF();
//     expect(action.type).toEqual('[Projects] Project lock - Fail');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnlockR action
//    *
//    * @test
//    */
//   it('should create projectsUnlockR action', () => {
//     const action = projectsUnlockR();
//     expect(action.type).toEqual('[Projects] Project unlock - Request');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnlockS action
//    *
//    * @test
//    */
//   it('should create projectsUnlockS action', () => {
//     const data = testProjectStatus;
//     const action = projectsUnlockS({ data });
//     expect(action.type).toEqual('[Projects] Project unlock - Success');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsUnlockF action
//    *
//    * @test
//    */
//   it('should create projectsUnlockF action', () => {
//     const action = projectsUnlockF();
//     expect(action.type).toEqual('[Projects] Project unlock - Fail');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeSort action
//    *
//    * @test
//    */
//   it('should create projectsChangeSort action', () => {
//     const sort = 'ASC';
//     const mode = 'features';
//     const action = projectsChangeSort({ sort, mode });
//     expect(action.type).toEqual('[Projects] Change Sort');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsChangeSortByDuration action
//    *
//    * @test
//    */
//   it('should create projectsChangeSortByDuration action', () => {
//     const sort = 'ASC';
//     const mode = 'features';
//     const action = projectsChangeSortByDuration({ sort, mode });
//     expect(action.type).toEqual('[Projects] Change Sort By Duration');
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsGetLastTimeOfRememberToRefreshCode action
//    *
//    * @test
//    */
//   it('should create projectsGetLastTimeOfRememberToRefreshCode action', () => {
//     const data = 1234567;
//     const action = projectsGetLastTimeOfRememberToRefreshCode({ data });
//     expect(action.type).toEqual(
//       '[Projects] Get Last Time Of Remember To Refresh Code'
//     );
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetLastTimeOfRememberToRefreshCode action
//    *
//    * @test
//    */
//   it('should create projectsSetLastTimeOfRememberToRefreshCode action', () => {
//     const data = 1234567;
//     const action = projectsSetLastTimeOfRememberToRefreshCode({ data });
//     expect(action.type).toEqual(
//       '[Projects] Set Last Time Of Remember To Refresh Code'
//     );
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetFeaturesFilter action
//    *
//    * @test
//    */
//   it('should create projectsSetFeaturesFilter action', () => {
//     const data = '';
//     const action = projectsSetFeaturesFilter({ data });
//     expect(action.type).toEqual('[Projects] Set Features Filter');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetCasesFilter action
//    *
//    * @test
//    */
//   it('should create projectsSetCasesFilter action', () => {
//     const data = '';
//     const action = projectsSetCasesFilter({ data });
//     expect(action.type).toEqual('[Projects] Set Cases Filter');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetSuitesFilter action
//    *
//    * @test
//    */
//   it('should create projectsSetSuitesFilter action', () => {
//     const data = '';
//     const action = projectsSetSuitesFilter({ data });
//     expect(action.type).toEqual('[Projects] Set Suites Filter');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetUnmarkedFilter action
//    *
//    * @test
//    */
//   it('should create projectsSetUnmarkedFilter action', () => {
//     const data = '';
//     const action = projectsSetUnmarkedFilter({ data });
//     expect(action.type).toEqual('[Projects] Set Unmarked Filter');
//     expect(action.data).toEqual(data);
//   });
//
//   /**
//    * @Feature Projects
//    * @Scenario Projects Actions
//    * @Case should create projectsSetTestsFilter action
//    *
//    * @test
//    */
//   it('should create projectsSetTestsFilter action', () => {
//     const data = '';
//     const action = projectsSetTestsFilter({ data });
//     expect(action.type).toEqual('[Projects] Set Tests Filter');
//     expect(action.data).toEqual(data);
//   });
// });
