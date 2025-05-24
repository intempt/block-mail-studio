
# Email Editor Tests

This directory contains all the test files for the Email Editor project, organized in a clean and maintainable structure.

## Structure

```
tests/
├── components/           # Component unit tests
│   ├── ui/              # UI component tests
│   └── *.test.tsx       # Component-specific tests
├── utils/               # Utility function tests
│   ├── blockUtils.test.ts
│   ├── emailUtils.test.ts
│   └── blockFactory.test.ts
├── services/            # Service layer tests (future)
├── integration/         # Integration tests
│   └── emailEditor.test.tsx
├── setup/              # Test setup files
│   └── setupTests.ts
├── __mocks__/          # Mock files
│   ├── TipTapProService.ts
│   └── EmailAIService.ts
├── vitest.config.ts    # Vitest configuration
├── tsconfig.json       # TypeScript config for tests
└── README.md           # This file
```

## Running Tests

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

Then run:

- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ui` - Open Vitest UI for interactive testing

## Writing Tests

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { YourComponent } from '@/components/YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Utility Tests
```typescript
import { yourUtilFunction } from '@/utils/yourUtils';

describe('yourUtilFunction', () => {
  it('should return expected result', () => {
    const result = yourUtilFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Testing Guidelines

1. **Arrange, Act, Assert**: Structure tests clearly
2. **Test behavior, not implementation**: Focus on what the component does
3. **Use descriptive test names**: Make it clear what's being tested
4. **Mock external dependencies**: Keep tests isolated
5. **Test edge cases**: Include error conditions and boundary values

## Coverage Goals

- Components: 80%+ coverage
- Utilities: 90%+ coverage
- Critical paths: 95%+ coverage

## Mock Strategy

- External services are mocked in `__mocks__/`
- Browser APIs are mocked in `setupTests.ts`
- Component dependencies are mocked per test as needed
