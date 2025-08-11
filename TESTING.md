# Testing Setup with Vitest

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

## Available Test Scripts

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once and exit
- `npm run test:ui` - Run tests with web UI
- `npm run coverage` - Run tests with coverage report

## Test Structure

Tests are organized in `src/test/` directory:

```
src/test/
├── setup.js              # Test setup and global mocks
├── example.test.js        # Basic example tests
├── components/            # Component tests
│   └── StatisticsCard.test.js
├── models/                # Model/constant tests
│   └── models.test.js
├── services/              # API service tests
│   └── eventApi.test.js
└── utils/                 # Utility function tests
    └── validation.test.js
```

## Test Configuration

Vitest is configured in `vite.config.js`:

```javascript
test: {
  globals: true,           // Enable global test functions
  environment: "jsdom",    // Browser-like environment for Vue components
  setupFiles: ["./src/test/setup.js"], // Global setup file
}
```

## Writing Tests

### Component Tests

Use `@vue/test-utils` for testing Vue components:

```javascript
import { mount } from "@vue/test-utils";
import MyComponent from "@/components/MyComponent.vue";

describe("MyComponent", () => {
  it("renders properly", () => {
    const wrapper = mount(MyComponent, {
      props: { message: "Hello" },
    });
    expect(wrapper.text()).toContain("Hello");
  });
});
```

### API Service Tests

Mock API calls using Vitest's built-in mocking:

```javascript
import { vi } from "vitest";

vi.mock("@/services/apiClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    // ... other methods
  },
}));
```

### Utility Function Tests

Test pure functions directly:

```javascript
import { myUtilFunction } from "@/utils/myUtils.js";

describe("myUtilFunction", () => {
  it("should return expected result", () => {
    expect(myUtilFunction("input")).toBe("expected");
  });
});
```

## Mocking

Common mocks are set up in `src/test/setup.js`:

- `window.matchMedia` - For components using media queries
- `ResizeObserver` - For components observing size changes
- `IntersectionObserver` - For components using intersection detection
- `fetch` - Global fetch function

## Coverage

To generate coverage reports:

```bash
npm run coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Best Practices

1. **Test file naming**: Use `.test.js` or `.spec.js` suffix
2. **Describe blocks**: Group related tests using `describe()`
3. **Mocking**: Mock external dependencies to isolate units under test
4. **Assertions**: Use descriptive assertions with clear expectations
5. **Setup/Cleanup**: Use `beforeEach`/`afterEach` for test isolation

## Examples

### Testing Vue Components

```javascript
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("MyComponent", () => {
  it("emits event when button clicked", async () => {
    const wrapper = mount(MyComponent);
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("clicked")).toBeTruthy();
  });
});
```

### Testing Async Functions

```javascript
describe("async function", () => {
  it("resolves with correct data", async () => {
    const result = await myAsyncFunction();
    expect(result).toEqual({ success: true });
  });
});
```

### Testing Error Handling

```javascript
describe("error handling", () => {
  it("throws error for invalid input", () => {
    expect(() => myFunction(null)).toThrow("Invalid input");
  });
});
```
