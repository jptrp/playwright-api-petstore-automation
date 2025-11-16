# Playwright API Petstore Automation

API automation testing for the Petstore API using Playwright.

## Prerequisites

- Node.js 20.x
- npm or yarn

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# Show test report
npm run report
```

## Project Structure

```
├── tests/              # Test files
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies
```

## Branching Strategy

- Main branch: `main`
- Feature branches: `feat/<short-name>`
  - Example: `feat/initial-setup`, `feat/ci-pipeline`

## Commit Conventions

- `feat:` - New features/tests
- `docs:` - Documentation changes
- `ci:` - CI changes
- `chore:` - Config/tooling
- `fix:` - Bug/failing test fixes

## API Under Test

- Base URL: https://petstore.swagger.io/v2
- Swagger Documentation: https://petstore.swagger.io/
