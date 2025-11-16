# Project File Tree

Complete file structure of the Playwright API Petstore Automation project.

```
playwright-api-petstore-automation/
│
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD pipeline
│
├── docs/
│   ├── setup.md                        # Detailed setup instructions
│   ├── architecture.md                 # System architecture documentation
│   └── test-plan.md                    # Comprehensive test plan
│
├── src/
│   ├── clients/
│   │   └── petstore-client.ts          # Main API client for Petstore
│   │
│   ├── config/
│   │   ├── api-endpoints.ts            # API endpoint constants
│   │   └── environment.ts              # Environment configuration
│   │
│   ├── fixtures/
│   │   └── pet-data.ts                 # Test data fixtures
│   │
│   ├── tests/
│   │   └── pets/
│   │       ├── createPet.spec.ts       # Create Pet tests (8 tests)
│   │       ├── getPet.spec.ts          # Get Pet tests (7 tests)
│   │       ├── updatePet.spec.ts       # Update Pet tests (10 tests)
│   │       ├── deletePet.spec.ts       # Delete Pet tests (8 tests)
│   │       ├── findByStatus.spec.ts    # Find by Status tests (7 tests)
│   │       └── negativeCases.spec.ts   # Negative tests (16 tests)
│   │
│   └── utils/
│       ├── logger.ts                   # Logging utility
│       ├── schema-validator.ts         # Zod schema validation
│       └── test-helpers.ts             # Helper functions
│
├── .eslintrc.js                        # ESLint configuration
├── .prettierrc                         # Prettier configuration
├── .gitignore                          # Git ignore patterns
├── .env.example                        # Environment variables template
├── CHANGELOG.md                        # Project changelog
├── LICENSE                             # MIT License
├── README.md                           # Project documentation
├── package.json                        # Project dependencies
├── playwright.config.ts                # Playwright configuration
└── tsconfig.json                       # TypeScript configuration
```

## File Count Summary

- **Configuration Files**: 7
- **Documentation Files**: 5
- **Source Code Files**: 13
- **Test Files**: 6
- **Total Files**: 31

## Lines of Code Summary

| Category | Files | Approximate LOC |
|----------|-------|-----------------|
| Test Cases | 6 | ~1,800 |
| Client & Utils | 5 | ~500 |
| Configuration | 7 | ~300 |
| Documentation | 5 | ~2,000 |
| **Total** | **23** | **~4,600** |

## Test Coverage Summary

| Test Suite | Test Cases | Coverage |
|------------|-----------|----------|
| Create Pet | 8 | CRUD Create operations |
| Get Pet | 7 | CRUD Read operations |
| Update Pet | 10 | CRUD Update operations |
| Delete Pet | 8 | CRUD Delete operations |
| Find by Status | 7 | Query operations |
| Negative Cases | 16 | Error handling |
| **Total** | **56** | **Complete API coverage** |

## Key Features

✅ 56 comprehensive test cases
✅ Modular architecture with reusable components
✅ Schema validation using Zod
✅ Type-safe TypeScript implementation
✅ Professional logging and debugging
✅ CI/CD ready with GitHub Actions
✅ Complete documentation
✅ Code quality tools (ESLint, Prettier)

## Directory Purpose

| Directory | Purpose |
|-----------|---------|
| `.github/workflows/` | CI/CD pipeline configuration |
| `docs/` | Project documentation |
| `src/clients/` | API client implementations |
| `src/config/` | Configuration management |
| `src/fixtures/` | Test data and fixtures |
| `src/tests/pets/` | Test suites for Pet API |
| `src/utils/` | Utility functions and helpers |

## Getting Started

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. View report: `npm run test:report`
4. Read documentation: `docs/setup.md`

For detailed information, see [README.md](../README.md)
