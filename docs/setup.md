# Setup Guide

Complete guide for setting up and running the Playwright API Petstore Automation project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Tests](#running-tests)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 20.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: Comes with Node.js
  - Verify installation: `npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Optional Software

- **Visual Studio Code**: Recommended IDE
  - Install Playwright Test extension for VS Code
- **Postman**: For manual API testing and exploration

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd playwright-api-petstore-automation
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Playwright Test framework
- TypeScript compiler
- Zod schema validation library
- ESLint and Prettier
- All required type definitions

### Step 3: Verify Installation

```bash
# Check TypeScript compilation
npm run type-check

# Check if Playwright is properly installed
npx playwright --version
```

## Configuration

### Environment Setup

Create a `.env` file in the project root (optional):

```bash
# API Configuration
API_BASE_URL=https://petstore.swagger.io/v2
NODE_ENV=production

# Logging
DEBUG=false

# Test Configuration
TIMEOUT=30000
RETRIES=2
```

### Playwright Configuration

The `playwright.config.ts` file contains all test configuration:

```typescript
export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  // ... more configuration
});
```

**Key Configuration Options:**

- `testDir`: Location of test files
- `timeout`: Maximum time for each test
- `fullyParallel`: Run tests in parallel
- `retries`: Number of retry attempts on failure
- `workers`: Number of parallel workers

### TypeScript Configuration

The `tsconfig.json` is pre-configured for optimal TypeScript usage:

- Strict mode enabled
- ES2022 target
- Node.js module resolution
- Source maps enabled

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser actions)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test suite
npm run test:pets

# View test report
npm run test:report
```

### Advanced Test Execution

```bash
# Run specific test file
npx playwright test src/tests/pets/createPet.spec.ts

# Run tests matching a pattern
npx playwright test --grep "should create"

# Run tests with specific tag
npx playwright test --grep @smoke

# Run tests on specific project
npx playwright test --project=api-tests

# Run tests with custom timeout
npx playwright test --timeout=60000

# Run tests with specific number of workers
npx playwright test --workers=2

# Run tests with trace on
npx playwright test --trace on
```

### Running Individual Test Suites

```bash
# Create Pet tests
npx playwright test src/tests/pets/createPet.spec.ts

# Get Pet tests
npx playwright test src/tests/pets/getPet.spec.ts

# Update Pet tests
npx playwright test src/tests/pets/updatePet.spec.ts

# Delete Pet tests
npx playwright test src/tests/pets/deletePet.spec.ts

# Find by Status tests
npx playwright test src/tests/pets/findByStatus.spec.ts

# Negative test cases
npx playwright test src/tests/pets/negativeCases.spec.ts
```

## Development Workflow

### Before Making Changes

```bash
# Create a new branch
git checkout -b feature/my-new-feature

# Ensure all tests pass
npm test

# Check code quality
npm run lint
npm run type-check
```

### After Making Changes

```bash
# Format code
npm run format

# Run linter
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Commit changes
git add .
git commit -m "Description of changes"
git push origin feature/my-new-feature
```

## IDE Setup (VS Code)

### Recommended Extensions

Install these VS Code extensions:

1. **Playwright Test for VSCode** (ms-playwright.playwright)
   - Run and debug tests from the editor
   - View test results inline
   - Record tests

2. **ESLint** (dbaeumer.vscode-eslint)
   - Real-time linting

3. **Prettier** (esbenp.prettier-vscode)
   - Code formatting

4. **TypeScript** (built-in)
   - TypeScript language support

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Troubleshooting

### Common Issues

#### Issue: Module not found errors

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Run type check to see all errors
npm run type-check
```

#### Issue: Tests timing out

**Solution:**
- Increase timeout in `playwright.config.ts`
- Check network connectivity to API
- Verify API is accessible: `curl https://petstore.swagger.io/v2/pet/1`

#### Issue: Tests failing intermittently

**Solution:**
- Enable retries in config
- Add proper wait conditions
- Check for race conditions
- Review test isolation

#### Issue: Cannot connect to API

**Solution:**
```bash
# Test API connectivity
curl -X GET "https://petstore.swagger.io/v2/pet/findByStatus?status=available" -H "accept: application/json"

# Check environment variables
echo $API_BASE_URL

# Try with different base URL
API_BASE_URL=https://petstore.swagger.io/v2 npm test
```

### Debug Mode

Enable detailed logging:

```bash
# Enable debug logging
DEBUG=true npm test

# Run with Playwright debug mode
npx playwright test --debug

# Run with trace
npx playwright test --trace on
```

### Getting Help

1. Check the [Playwright documentation](https://playwright.dev/)
2. Review test logs in `test-results/` directory
3. Check HTML report: `npm run test:report`
4. Open an issue in the repository

## Next Steps

- Read [Architecture Documentation](architecture.md)
- Review [Test Plan](test-plan.md)
- Explore the test suites in `src/tests/pets/`
- Try writing your own test cases

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update Playwright specifically
npm install @playwright/test@latest
```

### Keeping Tests Up to Date

- Regularly run tests to ensure they still pass
- Update tests when API changes
- Add new tests for new features
- Remove or update deprecated test cases

## Performance Tips

1. **Use parallel execution**: Enabled by default in config
2. **Run only needed tests**: Use `--grep` to filter
3. **Optimize fixtures**: Reuse test data when possible
4. **Clean up resources**: Always dispose of API clients
5. **Use appropriate timeouts**: Don't make them too long

## Security Best Practices

1. **Never commit sensitive data**: Use environment variables
2. **Use HTTPS**: Ensure API calls use secure connections
3. **Validate inputs**: Check all data before sending to API
4. **Handle errors properly**: Don't expose sensitive information in logs
5. **Keep dependencies updated**: Run `npm audit` regularly

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```
