# Vitest Test Commands

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once and exit
npm run test:run

# Run tests with a beautiful web UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Test Patterns

```bash
# Run tests matching a pattern
npx vitest run src/test/components

# Run a specific test file
npx vitest run src/test/example.test.js

# Run tests matching a name pattern
npx vitest run --grep "StatisticsCard"
```

### Development Workflow

1. Start in watch mode: `npm test`
2. Make changes to your code
3. Tests automatically re-run
4. See results in terminal

### Web UI Mode

1. Run: `npm run test:ui`
2. Open browser to the displayed URL (usually http://localhost:51204)
3. Interactive test runner with:
   - Visual test results
   - Code coverage
   - Test file explorer
   - Real-time updates

## Test Structure

### File Naming

- `*.test.js` - Unit tests
- `*.spec.js` - Specification tests
- Place tests in `src/test/` directory

### Test Organization

```javascript
describe("Component/Module Name", () => {
  describe("specific functionality", () => {
    it("should do something specific", () => {
      // Test implementation
    });
  });
});
```

### Best Practices

1. **Descriptive test names**: Clearly state what is being tested
2. **Arrange-Act-Assert pattern**: Set up, execute, verify
3. **One assertion per test**: Keep tests focused
4. **Mock external dependencies**: Test in isolation
5. **Clean up after tests**: Use `beforeEach`/`afterEach` if needed

## Examples

### Testing Vue Components

```javascript
import { mount } from "@vue/test-utils";
import MyComponent from "@/components/MyComponent.vue";

describe("MyComponent", () => {
  it("renders with props", () => {
    const wrapper = mount(MyComponent, {
      props: { title: "Test Title" },
    });
    expect(wrapper.text()).toContain("Test Title");
  });
});
```

### Testing Utility Functions

```javascript
import { myFunction } from "@/utils/myUtils.js";

describe("myFunction", () => {
  it("returns expected result", () => {
    const result = myFunction("input");
    expect(result).toBe("expected output");
  });
});
```

### Testing with Mocks

```javascript
import { vi } from "vitest";

describe("API calls", () => {
  it("handles successful response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: "test" }),
    });
    global.fetch = mockFetch;

    // Test your function that uses fetch
  });
});
```
