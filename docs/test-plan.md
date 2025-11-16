# Test Plan

Comprehensive test plan for Swagger Petstore API v2 automation testing.

## Table of Contents

1. [Test Objectives](#test-objectives)
2. [Scope](#scope)
3. [Test Strategy](#test-strategy)
4. [Test Coverage](#test-coverage)
5. [Test Scenarios](#test-scenarios)
6. [Entry and Exit Criteria](#entry-and-exit-criteria)
7. [Test Execution](#test-execution)
8. [Defect Management](#defect-management)
9. [Reporting](#reporting)

## Test Objectives

### Primary Objectives

1. **Functional Validation**: Verify all Pet API endpoints work as specified
2. **Data Integrity**: Ensure data consistency across operations
3. **Error Handling**: Validate proper error responses and status codes
4. **Schema Compliance**: Verify API responses match expected schemas
5. **Edge Cases**: Test boundary conditions and unusual inputs

### Success Criteria

- ✅ All critical test cases pass (100%)
- ✅ No high-severity defects remain open
- ✅ Test coverage > 90% for API endpoints
- ✅ All response schemas validated
- ✅ Documentation is complete and accurate

## Scope

### In Scope

**Petstore API v2 - Pet Resource**:
- Create Pet (POST /pet)
- Get Pet by ID (GET /pet/{petId})
- Update Pet (PUT /pet)
- Delete Pet (DELETE /pet/{petId})
- Find Pets by Status (GET /pet/findByStatus)
- Update Pet with Form (POST /pet/{petId})

**Test Types**:
- Functional testing
- Negative testing
- Data validation testing
- Schema validation testing
- Integration testing

### Out of Scope

- Store and User endpoints (future phase)
- Performance testing
- Security testing (penetration testing)
- UI/Frontend testing
- Mobile API testing

## Test Strategy

### Testing Approach

**Automated API Testing**: All tests are automated using Playwright + TypeScript

**Test Pyramid**:
```
         ▲
        /E2E\ (10% - Full workflows)
       /─────\
      /Integr.\ (30% - API integration)
     /─────────\
    /   Unit    \ (60% - Component tests)
   /─────────────\
```

### Test Design Techniques

1. **Equivalence Partitioning**: Group similar inputs
2. **Boundary Value Analysis**: Test edge values
3. **Error Guessing**: Test likely failure scenarios
4. **Positive Testing**: Valid inputs and happy paths
5. **Negative Testing**: Invalid inputs and error paths

### Test Data Strategy

**Approach**: Data-driven testing with fixtures

**Data Management**:
- Static fixtures for common scenarios
- Dynamic generation for unique data
- Cleanup after each test
- No dependencies on external data

### Test Execution Strategy

**Execution Model**:
- Parallel execution (4 workers in CI)
- Independent tests (no dependencies)
- Automatic retries (2 retries in CI)
- Fail-fast approach for critical errors

## Test Coverage

### API Endpoint Coverage

| Endpoint | Method | Priority | Status |
|----------|--------|----------|--------|
| /pet | POST | High | ✅ Covered |
| /pet | PUT | High | ✅ Covered |
| /pet/{petId} | GET | High | ✅ Covered |
| /pet/{petId} | DELETE | High | ✅ Covered |
| /pet/{petId} | POST | Medium | ✅ Covered |
| /pet/findByStatus | GET | High | ✅ Covered |
| /pet/findByTags | GET | Low | ⚠️ Not Covered |
| /pet/{petId}/uploadImage | POST | Low | ⚠️ Not Covered |

### Test Coverage Matrix

| Category | Test Count | Status |
|----------|-----------|--------|
| Create Operations | 8 | ✅ Complete |
| Read Operations | 7 | ✅ Complete |
| Update Operations | 10 | ✅ Complete |
| Delete Operations | 8 | ✅ Complete |
| Query Operations | 7 | ✅ Complete |
| Negative Cases | 16 | ✅ Complete |
| **Total** | **56** | **✅ Complete** |

### Code Coverage

- **Line Coverage**: Target 90%+
- **Branch Coverage**: Target 85%+
- **Function Coverage**: Target 95%+

## Test Scenarios

### 1. Create Pet Tests (8 tests)

**File**: `createPet.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-CREATE-001 | Create pet with all fields | High | 200, pet created with all fields |
| TC-CREATE-002 | Create pet with required fields only | High | 200, pet created |
| TC-CREATE-003 | Create pet with available status | High | 200, status = available |
| TC-CREATE-004 | Create pet with pending status | Medium | 200, status = pending |
| TC-CREATE-005 | Create pet with sold status | Medium | 200, status = sold |
| TC-CREATE-006 | Create pet with category | Medium | 200, category populated |
| TC-CREATE-007 | Create pet with tags | Medium | 200, tags populated |
| TC-CREATE-008 | Create pet with multiple photos | Low | 200, multiple photoUrls |

### 2. Get Pet Tests (7 tests)

**File**: `getPet.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-GET-001 | Get existing pet by ID | High | 200, pet data returned |
| TC-GET-002 | Get non-existent pet | High | 404, error message |
| TC-GET-003 | Get pet with all fields | High | 200, all fields present |
| TC-GET-004 | Verify pet data after creation | High | 200, data matches |
| TC-GET-005 | Get pet with boundary ID (1) | Medium | 200 or 404 |
| TC-GET-006 | Get pet with large ID | Medium | 200 or 404 |
| TC-GET-007 | Verify correct data types | Medium | 200, types validated |

### 3. Update Pet Tests (10 tests)

**File**: `updatePet.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-UPDATE-001 | Update pet name | High | 200, name updated |
| TC-UPDATE-002 | Update pet status | High | 200, status updated |
| TC-UPDATE-003 | Update pet category | Medium | 200, category updated |
| TC-UPDATE-004 | Update pet tags | Medium | 200, tags updated |
| TC-UPDATE-005 | Update all pet fields | High | 200, all fields updated |
| TC-UPDATE-006 | Update status available→pending | High | 200, status changed |
| TC-UPDATE-007 | Update status pending→sold | High | 200, status changed |
| TC-UPDATE-008 | Update photo URLs | Medium | 200, photos updated |
| TC-UPDATE-009 | Update with form data | High | 200, data updated |
| TC-UPDATE-010 | Update only name with form | Medium | 200, name updated |

### 4. Delete Pet Tests (8 tests)

**File**: `deletePet.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-DELETE-001 | Delete existing pet | High | 200, pet deleted |
| TC-DELETE-002 | Delete non-existent pet | High | 200 or 404 |
| TC-DELETE-003 | Delete pet with available status | High | 200, deleted |
| TC-DELETE-004 | Delete pet with pending status | Medium | 200, deleted |
| TC-DELETE-005 | Delete pet with sold status | Medium | 200, deleted |
| TC-DELETE-006 | Verify deletion persistence | High | 404 on GET |
| TC-DELETE-007 | Delete recently created pet | High | 200, deleted |
| TC-DELETE-008 | Delete pet with complex data | Medium | 200, deleted |

### 5. Find by Status Tests (7 tests)

**File**: `findByStatus.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-FIND-001 | Find pets by available status | High | 200, available pets |
| TC-FIND-002 | Find pets by pending status | High | 200, pending pets |
| TC-FIND-003 | Find pets by sold status | High | 200, sold pets |
| TC-FIND-004 | Compare different status results | Medium | Different results |
| TC-FIND-005 | Find created pet by status | High | 200, pet found |
| TC-FIND-006 | Verify response structure | High | 200, valid structure |
| TC-FIND-007 | Verify filtering after update | High | 200, correct filtering |

### 6. Negative Test Cases (16 tests)

**File**: `negativeCases.spec.ts`

| Test Case | Description | Priority | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-NEG-001 | Get non-existent pet ID | High | 404, error response |
| TC-NEG-002 | Get pet with ID = 0 | High | 400 or 404 |
| TC-NEG-003 | Get pet with negative ID | High | 400 or 404 |
| TC-NEG-004 | Create pet without name | High | 400 or 405 |
| TC-NEG-005 | Create pet without photoUrls | High | 400 or 405 |
| TC-NEG-006 | Create pet with empty object | High | 400 or 405 |
| TC-NEG-007 | Create pet with null values | High | 400 or 405 |
| TC-NEG-008 | Create pet with invalid status | Medium | 200 or 400 |
| TC-NEG-009 | Update non-existent pet | High | 200 or 404 |
| TC-NEG-010 | Delete already deleted pet | High | 200 or 404 |
| TC-NEG-011 | Create pet with very long name | Medium | 200, 400, or 413 |
| TC-NEG-012 | Create pet with special chars | Medium | 200 or 400 |
| TC-NEG-013 | Create pet with empty name | High | 200 or 400 |
| TC-NEG-014 | Create pet with empty photoUrls | Medium | 200 or 400 |
| TC-NEG-015 | Create pet with invalid URL | Low | 200 or 400 |
| TC-NEG-016 | Concurrent delete operations | Low | At least one succeeds |

## Entry and Exit Criteria

### Entry Criteria

- ✅ Test environment is set up and accessible
- ✅ API is deployed and stable
- ✅ Test automation framework is ready
- ✅ Test data fixtures are prepared
- ✅ All dependencies are installed

### Exit Criteria

- ✅ All planned tests are executed
- ✅ Critical/High priority tests pass 100%
- ✅ No critical defects remain open
- ✅ Test coverage goals are met (>90%)
- ✅ Test execution report is generated
- ✅ All documentation is updated

### Suspension Criteria

Test execution will be suspended if:
- ⛔ API is unavailable or unstable
- ⛔ Critical defects block test execution
- ⛔ Test environment is down
- ⛔ Major API changes break all tests

### Resumption Criteria

Testing can resume when:
- ✅ Blocking issues are resolved
- ✅ API is stable and accessible
- ✅ Test environment is restored
- ✅ Test scripts are updated for API changes

## Test Execution

### Execution Schedule

**Local Development**:
- On-demand execution by developers
- Before committing code changes
- During feature development

**CI/CD Pipeline**:
- On every push to main branch
- On every pull request
- Nightly regression runs
- Pre-deployment validation

### Execution Environment

**Environments**:
1. **Production**: https://petstore.swagger.io/v2 (default)
2. **Staging**: (if available)
3. **Local**: (for development)

**Configuration**:
- Node.js 20.x
- Playwright latest stable
- 4 parallel workers in CI
- 2 retries for flaky tests

### Test Execution Process

1. **Pre-execution**:
   - Verify environment availability
   - Check test data fixtures
   - Clear previous test results

2. **Execution**:
   - Run tests in parallel
   - Capture logs and traces
   - Generate test reports

3. **Post-execution**:
   - Cleanup test data
   - Archive test results
   - Send notifications

## Defect Management

### Defect Severity

**Critical**: API is down or major functionality broken
**High**: Core functionality doesn't work as expected
**Medium**: Minor functionality issues
**Low**: Cosmetic or documentation issues

### Defect Priority

**P0**: Fix immediately
**P1**: Fix in current sprint
**P2**: Fix in next sprint
**P3**: Fix when time permits

### Defect Workflow

1. **Identification**: Test fails, defect suspected
2. **Investigation**: Verify it's a real defect
3. **Logging**: Create detailed defect report
4. **Triage**: Assign severity and priority
5. **Resolution**: Developer fixes the issue
6. **Verification**: Re-run failed tests
7. **Closure**: Mark as resolved if tests pass

### Defect Report Template

```
Title: [Component] Brief description

Description:
- What happened
- What was expected
- Steps to reproduce

Environment:
- API URL
- Test case ID
- Timestamp

Severity: Critical/High/Medium/Low
Priority: P0/P1/P2/P3

Attachments:
- Test logs
- Screenshots (if applicable)
- Request/Response data
```

## Reporting

### Test Reports

**Generated Reports**:
1. **HTML Report**: Visual test results (playwright-report/)
2. **JSON Report**: Machine-readable results (test-results/results.json)
3. **JUnit Report**: CI integration (test-results/junit.xml)
4. **Console Output**: Real-time progress

### Report Contents

Each report includes:
- Total tests executed
- Tests passed/failed/skipped
- Execution time
- Failure details
- Test trends (in CI)

### Metrics Tracked

1. **Test Execution Metrics**:
   - Total tests executed
   - Pass rate
   - Fail rate
   - Execution time
   - Flaky test rate

2. **Coverage Metrics**:
   - Endpoint coverage
   - Code coverage
   - Scenario coverage

3. **Quality Metrics**:
   - Defect density
   - Defect resolution time
   - Test stability

### Stakeholder Communication

**Daily**: Test execution status (automated)
**Weekly**: Test summary and trends
**Sprint End**: Comprehensive test report
**Release**: Test sign-off document

### Sample Test Summary

```
Test Execution Summary
======================
Date: 2025-11-15
Environment: Production
Duration: 2m 34s

Results:
✅ Passed: 54
❌ Failed: 2
⏭️ Skipped: 0
Total: 56

Pass Rate: 96.4%

Failed Tests:
1. TC-NEG-008: Create pet with invalid status
2. TC-UPDATE-007: Update status pending→sold

Coverage:
- Endpoint Coverage: 87.5%
- Test Coverage: 100%

Next Steps:
- Investigate failed tests
- Create defect reports
- Re-run after fixes
```

## Risk Assessment

### Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API instability | High | Medium | Retry logic, monitoring |
| Test data conflicts | Medium | Low | Unique IDs, cleanup |
| Environment downtime | High | Low | Multiple environments |
| Flaky tests | Medium | Medium | Proper waits, retries |
| API changes | High | Medium | Schema validation, alerts |

## Test Maintenance

### Maintenance Activities

1. **Weekly**:
   - Review failed tests
   - Update test data
   - Check for flaky tests

2. **Monthly**:
   - Update dependencies
   - Review test coverage
   - Optimize slow tests
   - Update documentation

3. **Quarterly**:
   - Comprehensive test review
   - Remove obsolete tests
   - Add new test scenarios
   - Performance optimization

### Version Control

- All test code in Git
- Feature branches for new tests
- Code reviews required
- CI checks before merge

## Continuous Improvement

### Improvement Areas

1. **Expand Coverage**: Add Store and User endpoints
2. **Performance**: Add load testing
3. **Contract Testing**: Implement Pact
4. **Visual Reports**: Enhanced dashboards
5. **Test Data**: Better data management

### Review Cycle

- After each sprint
- Quarterly comprehensive review
- Incorporate feedback from:
  - Test execution results
  - Developer feedback
  - Defect analysis
  - Stakeholder input

## Appendix

### Glossary

- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **CI/CD**: Continuous Integration/Continuous Deployment
- **REST**: Representational State Transfer

### References

- [Swagger Petstore API Documentation](https://petstore.swagger.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Project README](../README.md)
- [Architecture Documentation](architecture.md)
- [Setup Guide](setup.md)

### Test Execution Logs

All test execution logs are stored in:
- `test-results/` directory
- `playwright-report/` directory
- CI/CD artifacts (GitHub Actions)
