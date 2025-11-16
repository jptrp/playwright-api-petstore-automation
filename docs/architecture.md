# Architecture Documentation

Comprehensive overview of the system architecture, design patterns, and implementation details.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [Design Patterns](#design-patterns)
5. [Component Details](#component-details)
6. [Data Flow](#data-flow)
7. [Testing Strategy](#testing-strategy)

## System Overview

The Playwright API Petstore Automation framework is designed as a modular, scalable, and maintainable test automation solution for REST API testing.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Test Execution Layer                  │
│  (Playwright Test Runner + TypeScript Test Specs)      │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                  Test Orchestration                     │
│  - Test Fixtures  - Test Helpers  - Test Data          │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                   Client Layer                          │
│  (PetStoreClient - API Request/Response Handling)       │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                  Utility Layer                          │
│  - Validation  - Logging  - Configuration              │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│              External API (Petstore)                    │
└─────────────────────────────────────────────────────────┘
```

## Architecture Principles

### 1. Separation of Concerns

Each layer has a specific responsibility:
- **Test Layer**: Test logic and assertions
- **Client Layer**: API communication
- **Utility Layer**: Shared functionality
- **Config Layer**: Environment and endpoint configuration

### 2. DRY (Don't Repeat Yourself)

- Reusable API client methods
- Shared test fixtures and helpers
- Centralized configuration
- Common validation schemas

### 3. SOLID Principles

- **Single Responsibility**: Each class/module has one job
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Components are interchangeable
- **Interface Segregation**: Focused interfaces
- **Dependency Inversion**: Depend on abstractions

### 4. Type Safety

- TypeScript for compile-time type checking
- Zod schemas for runtime validation
- Strongly typed API responses
- Type inference for better DX

### 5. Maintainability

- Clear folder structure
- Consistent naming conventions
- Comprehensive documentation
- Self-documenting code

## Project Structure

```
playwright-api-petstore-automation/
│
├── src/                          # Source code root
│   ├── clients/                  # API client implementations
│   │   └── petstore-client.ts    # Main API client for Petstore
│   │
│   ├── config/                   # Configuration management
│   │   ├── api-endpoints.ts      # API endpoint constants
│   │   └── environment.ts        # Environment configuration
│   │
│   ├── fixtures/                 # Test data fixtures
│   │   └── pet-data.ts           # Pet-related test data
│   │
│   ├── tests/                    # Test suites
│   │   └── pets/                 # Pet resource tests
│   │       ├── createPet.spec.ts # Create operations
│   │       ├── getPet.spec.ts    # Read operations
│   │       ├── updatePet.spec.ts # Update operations
│   │       ├── deletePet.spec.ts # Delete operations
│   │       ├── findByStatus.spec.ts # Query operations
│   │       └── negativeCases.spec.ts # Error scenarios
│   │
│   └── utils/                    # Utility functions
│       ├── logger.ts             # Logging utility
│       ├── schema-validator.ts   # Response validation
│       └── test-helpers.ts       # Helper functions
│
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD pipelines
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## Design Patterns

### 1. Client Pattern (API Client)

**Purpose**: Encapsulate all API communication logic in a single reusable client.

**Implementation**:
```typescript
export class PetStoreClient {
  private context: APIRequestContext;
  
  async init(): Promise<void> {
    this.context = await request.newContext({...});
  }
  
  async createPet(data: Pet): Promise<Response> {
    return await this.context.post('/pet', { data });
  }
}
```

**Benefits**:
- Centralized API logic
- Easy to mock for testing
- Consistent error handling
- Reusable across tests

### 2. Fixture Pattern (Test Data)

**Purpose**: Provide reusable, consistent test data.

**Implementation**:
```typescript
export const validPetData: Partial<Pet> = {
  name: 'Fluffy',
  photoUrls: ['https://example.com/fluffy.jpg'],
  status: 'available',
};
```

**Benefits**:
- Consistent test data
- Easy to maintain
- Reduces duplication
- Clear test intent

### 3. Factory Pattern (Test Data Generation)

**Purpose**: Generate test data dynamically.

**Implementation**:
```typescript
export const createPetWithStatus = (status: Status): Pet => ({
  name: `Pet-${status}-${Date.now()}`,
  photoUrls: [`https://example.com/${status}.jpg`],
  status,
});
```

**Benefits**:
- Dynamic data generation
- Unique test data per run
- Flexible test scenarios
- Prevents data conflicts

### 4. Builder Pattern (API Requests)

**Purpose**: Construct complex API requests step by step.

**Implementation**: Implicit in client methods with optional parameters.

### 5. Strategy Pattern (Validation)

**Purpose**: Different validation strategies for different scenarios.

**Implementation**:
```typescript
export const validateSchema = <T>(data: unknown, schema: ZodSchema<T>) => {
  return schema.parse(data);
};
```

## Component Details

### 1. PetStoreClient

**Responsibility**: Handle all Petstore API interactions.

**Key Features**:
- Connection management (init/dispose)
- CRUD operations for pets
- Query operations (findByStatus, findByTags)
- Form-based updates
- Image upload support

**Methods**:
- `init()`: Initialize API context
- `dispose()`: Clean up resources
- `createPet()`: Create a new pet
- `getPetById()`: Retrieve pet by ID
- `updatePet()`: Update existing pet
- `deletePet()`: Delete a pet
- `findPetsByStatus()`: Find pets by status
- `updatePetWithForm()`: Update using form data

### 2. Schema Validator

**Responsibility**: Validate API responses against expected schemas.

**Key Features**:
- Zod-based validation
- Type inference
- Detailed error messages
- Runtime type safety

**Schemas**:
- `PetSchema`: Complete pet object
- `CategorySchema`: Pet category
- `TagSchema`: Pet tags
- `ApiResponseSchema`: Generic API response
- `PetArraySchema`: Array of pets

### 3. Logger

**Responsibility**: Provide structured logging for debugging.

**Key Features**:
- Log levels (DEBUG, INFO, WARN, ERROR)
- Timestamp tracking
- JSON pretty-printing
- Environment-based control

### 4. Test Helpers

**Responsibility**: Common utility functions for tests.

**Key Functions**:
- `generateUniqueId()`: Generate unique pet IDs
- `randomString()`: Generate random strings
- `sleep()`: Async delay
- `retry()`: Retry failed operations
- `assertStatusCode()`: HTTP status assertions

### 5. Configuration

**Responsibility**: Manage environment-specific settings.

**Components**:
- `environment.ts`: Environment configuration
- `api-endpoints.ts`: API endpoint constants

**Features**:
- Multi-environment support
- Environment variable overrides
- Type-safe configuration
- Default values

## Data Flow

### Create Pet Flow

```
1. Test Case
   └─> Create pet data (fixtures)
   
2. Test Execution
   └─> Call client.createPet(data)
   
3. API Client
   └─> POST request to /pet
   
4. API Response
   └─> Return status + body
   
5. Validation
   └─> Schema validation (Zod)
   
6. Assertions
   └─> Expect status = 200
   └─> Expect body structure
   
7. Cleanup
   └─> Delete created pet
```

### Error Handling Flow

```
1. Test Execution
   └─> API call with invalid data
   
2. API Response
   └─> Error status (400, 404, etc.)
   
3. Client Layer
   └─> Returns error response
   
4. Test Assertions
   └─> Verify error status
   └─> Validate error schema
   
5. Logging
   └─> Log error details
```

## Testing Strategy

### Test Organization

Tests are organized by:
1. **Resource**: Tests grouped by API resource (pets, store, user)
2. **Operation**: Tests for specific operations (CRUD)
3. **Scenario**: Positive, negative, edge cases

### Test Isolation

Each test:
- Creates its own test data
- Cleans up after execution
- Uses unique identifiers
- Doesn't depend on other tests

### Test Lifecycle

```
beforeAll → beforeEach → test → afterEach → afterAll
    ↓           ↓          ↓         ↓          ↓
  Setup    Init Client  Execute  Cleanup   Teardown
```

### Assertion Strategy

1. **HTTP Status**: Verify response status code
2. **Schema**: Validate response structure
3. **Data**: Check specific field values
4. **Side Effects**: Verify state changes

### Error Handling

- Expected errors are tested explicitly
- Unexpected errors are logged and fail tests
- Cleanup runs even if test fails
- Retries for flaky scenarios

## Scalability

### Adding New Resources

1. Create new client methods in `PetStoreClient` or new client class
2. Add endpoint constants to `api-endpoints.ts`
3. Create test fixtures in `fixtures/`
4. Add test suites in `tests/`
5. Update schemas in `schema-validator.ts`

### Adding New Test Cases

1. Identify the appropriate test file
2. Add test case following existing patterns
3. Use shared fixtures and helpers
4. Add cleanup logic
5. Update test plan documentation

### Extending Functionality

- **Custom Assertions**: Add to `test-helpers.ts`
- **New Schemas**: Add to `schema-validator.ts`
- **Configuration**: Extend `environment.ts`
- **Logging**: Enhance `logger.ts`

## Performance Considerations

### Parallel Execution

- Tests run in parallel by default
- Each test is independent
- Shared resources are avoided
- Unique IDs prevent conflicts

### Resource Management

- API clients are disposed properly
- No connection leaks
- Cleanup in afterEach/afterAll
- Timeout management

### Optimization Tips

1. Use `beforeAll` for expensive setup
2. Minimize API calls per test
3. Batch cleanup operations
4. Use appropriate timeouts
5. Cache static data

## Security

### Best Practices

1. **No Hardcoded Secrets**: Use environment variables
2. **HTTPS Only**: Enforce secure connections
3. **Input Validation**: Validate before sending to API
4. **Error Messages**: Don't expose sensitive data
5. **Dependencies**: Keep updated and audited

### Data Privacy

- Use test data only
- Don't log sensitive information
- Clean up test data
- Use anonymized data

## Maintenance

### Code Quality

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Type checking in CI

### Documentation

- Inline comments for complex logic
- JSDoc for public methods
- README for project overview
- Architecture docs for design

### Versioning

- Semantic versioning
- Changelog maintenance
- Git tags for releases
- Backward compatibility

## Future Enhancements

### Potential Improvements

1. **Performance Testing**: Add load tests with k6
2. **Contract Testing**: Implement Pact or similar
3. **Mock Server**: Local mock for offline testing
4. **Test Data Management**: Database for test data
5. **Visual Reports**: Enhanced HTML reports
6. **Metrics**: Test execution metrics and trends
7. **Integration**: Integrate with test management tools

### Roadmap

- Phase 1: Core functionality (Complete ✅)
- Phase 2: Advanced validation and reporting
- Phase 3: Performance and contract testing
- Phase 4: Test data management
- Phase 5: CI/CD enhancements
