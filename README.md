# Playwright API Petstore Automation

Production-ready API automation testing framework for the Swagger Petstore API v2, built with Playwright and TypeScript.

## 🎯 Overview

This project provides a comprehensive test automation suite for the [Swagger Petstore API](https://petstore.swagger.io/v2), featuring:

- **40+ test cases** covering CRUD operations, negative scenarios, and edge cases
- **Modular architecture** with reusable API clients and utilities
- **Schema validation** using Zod for response verification
- **Type-safe** TypeScript implementation throughout
- **CI/CD ready** with GitHub Actions integration
- **Professional logging** and reporting

## 📋 Features

- ✅ Complete CRUD operations for Pet resources
- ✅ Status-based filtering and search
- ✅ Comprehensive negative test coverage
- ✅ Schema validation for all responses
- ✅ Data-driven testing approach
- ✅ Boundary and edge case testing
- ✅ Parallel test execution
- ✅ HTML and JSON reporting
- ✅ Automatic retry on failure

## 🛠️ Tech Stack

- **Playwright Test** - API testing framework
- **TypeScript** - Type-safe JavaScript
- **Zod** - Schema validation library
- **Node.js 20+** - Runtime environment
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
playwright-api-petstore-automation/
├── src/
│   ├── clients/           # API client implementations
│   │   └── petstore-client.ts
│   ├── config/            # Configuration files
│   │   ├── api-endpoints.ts
│   │   └── environment.ts
│   ├── fixtures/          # Test data fixtures
│   │   └── pet-data.ts
│   ├── tests/             # Test suites
│   │   └── pets/
│   │       ├── createPet.spec.ts
│   │       ├── getPet.spec.ts
│   │       ├── updatePet.spec.ts
│   │       ├── deletePet.spec.ts
│   │       ├── findByStatus.spec.ts
│   │       └── negativeCases.spec.ts
│   └── utils/             # Utility functions
│       ├── logger.ts
│       ├── schema-validator.ts
│       └── test-helpers.ts
├── docs/                  # Documentation
│   ├── setup.md
│   ├── architecture.md
│   └── test-plan.md
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI/CD
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-api-petstore-automation

# Install dependencies
npm install

# Install Playwright browsers (optional for API tests)
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:pets

# Run tests in UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

## 📊 Test Coverage

### Test Suites

1. **Create Pet Tests** (`createPet.spec.ts`)
   - Create pet with all fields
   - Create pet with required fields only
   - Create pet with different statuses
   - Create pet with categories and tags

2. **Get Pet Tests** (`getPet.spec.ts`)
   - Get existing pet by ID
   - Get non-existent pet (404 handling)
   - Boundary ID values
   - Data type validation

3. **Update Pet Tests** (`updatePet.spec.ts`)
   - Update pet name, status, category
   - Update all fields
   - Update with form data
   - Status transitions

4. **Delete Pet Tests** (`deletePet.spec.ts`)
   - Delete existing pet
   - Delete non-existent pet
   - Delete pets with different statuses
   - Verify deletion persistence

5. **Find by Status Tests** (`findByStatus.spec.ts`)
   - Find pets by available status
   - Find pets by pending status
   - Find pets by sold status
   - Filter validation
   - Status update verification

6. **Negative Tests** (`negativeCases.spec.ts`)
   - Invalid pet IDs (negative, zero, non-existent)
   - Missing required fields
   - Empty and null values
   - Invalid status values
   - Extremely long inputs
   - Special characters handling
   - Concurrent operations

## 🔧 Configuration

### Environment Variables

```bash
# Base URL for API (default: https://petstore.swagger.io/v2)
API_BASE_URL=https://petstore.swagger.io/v2

# Node environment (production, staging, development)
NODE_ENV=production

# Enable debug logging
DEBUG=true
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test timeout and retries
- Reporter settings
- Parallel execution workers
- Base URL and headers

## 📝 Writing Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { assertSchema, PetSchema } from '../../utils/schema-validator';

test.describe('My Pet Tests', () => {
  let client: PetStoreClient;

  test.beforeEach(async () => {
    client = new PetStoreClient();
    await client.init();
  });

  test.afterEach(async () => {
    await client.dispose();
  });

  test('should create a pet', async () => {
    const { status, body } = await client.createPet({
      name: 'TestPet',
      photoUrls: ['https://example.com/pet.jpg'],
    });

    expect(status).toBe(200);
    assertSchema(body, PetSchema);
  });
});
```

## 🔍 API Client Usage

```typescript
import { PetStoreClient } from './src/clients/petstore-client';

const client = new PetStoreClient();
await client.init();

// Create a pet
const { status, body } = await client.createPet({
  name: 'Fluffy',
  photoUrls: ['https://example.com/fluffy.jpg'],
  status: 'available',
});

// Get pet by ID
const pet = await client.getPetById(body.id);

// Update pet
await client.updatePet({
  id: body.id,
  name: 'Fluffy Updated',
  photoUrls: ['https://example.com/fluffy.jpg'],
  status: 'sold',
});

// Find by status
const availablePets = await client.findPetsByStatus('available');

// Delete pet
await client.deletePet(body.id);

await client.dispose();
```

## 🎨 Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📈 CI/CD

The project includes a GitHub Actions workflow that:
1. Runs on push and pull requests
2. Tests on Node.js 20.x
3. Installs dependencies
4. Executes all tests
5. Uploads HTML reports as artifacts
6. Generates test result summaries

See `.github/workflows/ci.yml` for details.

## 📖 Documentation

- [Setup Guide](docs/setup.md) - Detailed setup instructions
- [Architecture](docs/architecture.md) - System design and patterns
- [Test Plan](docs/test-plan.md) - Testing strategy and coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Senior SDET

## 🔗 Links

- [Swagger Petstore API](https://petstore.swagger.io/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zod Documentation](https://zod.dev/)

## 📞 Support

For issues and questions, please open an issue in the repository.

- `chore:` - Config/tooling
- `fix:` - Bug/failing test fixes

## API Under Test

- Base URL: https://petstore.swagger.io/v2
- Swagger Documentation: https://petstore.swagger.io/
