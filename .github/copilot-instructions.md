# Copilot Instructions – Vue 3 Composition API + NaiveUI + Vite

These guidelines tell GitHub Copilot how to suggest code in this project.

## General Rules

- Use **Vue 3 Composition API** (`<script setup>`).
- Always import UI components from **NaiveUI** (https://www.naiveui.com).
- Follow the **Vite** project structure:
  src/
  components/
  pages/
  composables/
  services/
  assets/
  styles/

  - create alway a vue file for each component in `src/components/`.\
  - create composables in `src/composables/` for reusable logic.
  - create services in `src/services/` for API calls.
  - cereate pages in `src/pages/` for route components.

- Use **PascalCase** for component filenames and names.
- Use **camelCase** for variables and functions.

---

## Components

- Components go in `src/components`.
- Must use `<script setup>`.
- Use **NaiveUI** components (e.g., `<n-button>`, `<n-card>`).
  - create controllers in `src/controllers/` for handling business logic.
- Style components with **Tailwind CSS** classes when possible; otherwise use scoped CSS.

Example:

```vue
<template>
  <n-card class="p-4">
    <n-input v-model:value="username" placeholder="Enter name" />
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NInput } from "naive-ui";

const username = ref("");
</script>
```

# NaiveUI Usage

-Import only the components needed in each file:
-import { NButton, NModal } from 'naive-ui'
-Prefer NaiveUI layouts over raw HTML for consistent styling.

- Use n-grid and n-gi for responsive layouts.

# State Management

- Use Pinia for global state.
- Store files go in src/stores/ with useXStore naming.
- Persist state with pinia-plugin-persistedstate when needed.

# API Calls

- All API requests go in src/services/.
- Use fetch or axios wrapped in reusable functions.
- Always return typed responses.

# Best Practices

- DRY: Extract repeated logic into composables or components.
- Keep components small and focused (max ~150 lines).
- Avoid in-template business logic; compute values in <script setup> or computed properties.
- Use v-for keys that are unique and stable.
- Use defineExpose only when absolutely necessary.

# Copilot Hints

- When asking Copilot for help:
- Specify Vue 3 Composition API explicitly.
- Mention NaiveUI components you want.
- Tell Copilot to "generate DRY reusable composables" for shared logic.
- Give it sample data formats when generating forms or tables.
- If generating forms, request NaiveUI <n-form> + validation rules.

# Composable for fetching data

- Place reusable logic in src/composables.
- Naming: useThing.ts (e.g., useFetch.ts).
- Always type function return values.

```
// src/composables/useFetch.ts
import { ref } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)

  async function fetchData() {
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } catch (err) {
      error.value = String(err)
    }
  }

  return { data, error, fetchData }
}
```

### MongoDB Schema Patterns

- **Event Schema**: 50+ biometric fields (`HeartRate`, `EDA`, `Temperature`, `RespiratoryRate`, etc.)
- **Reference Pattern**: `parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }`
- **Collection Names**: Explicit collection names in schema options (`collection: "child_events_db"`)
- **Flexible Schema**: Event schema uses `strict: false` for sensor data variation
- **Unique Constraints**: Waitlist uses unique email index with duplicate error handling (error.code === 11000)

### Validation Strategy

- **Joi Schemas**: Located in `src/validators/index.js` with comprehensive field validation
- **Required Fields**: Events require `aid` (child ID), Users require `firstName/lastName/email`
- **Phone Validation**: Uses regex patterns for international phone numbers
- **Express Validator**: Admin and waitlist routes use express-validator middleware
- **Email Validation**: Waitlist uses both Joi and express-validator for email format checking

## Testing Framework

### Test Configuration

- **Development**: `npm test` - MongoDB Memory Server with ES modules (`--experimental-vm-modules`)
- **Production**: `npm run test:prod` - Live server testing against `http://64.225.63.66`
- **Integration**: Tests hit actual API endpoints with JWT authentication
- **Waitlist Tests**: `tests/test-waitlist.js` covers public API endpoints and duplicate handling

### Test Data Patterns

```javascript
// Standard test user creation
const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@test.com",
  mobile: "1234567890",
  password: "testPassword123",
};

// Waitlist test data
const waitlistData = {
  email: "test@example.com",
  name: "Test User",
  source: "website",
  notes: "Testing purposes",
};

// JWT token generation for tests
const testToken = jwt.sign({ id: userId, email: testUser.email }, JWT_SECRET);
```

### Route Testing Patterns

- **Event Routes**: `/api/event/*` - All require authentication except documentation
- **Child Routes**: `/api/child-users/id/:id` (note: not `/api/child-users/:id`)
- **Auth Routes**: `/api/auth/*` for registration/login, `/api/user/*` for profile management
- **Waitlist Routes**: `/api/waitlist` POST is public, GET/DELETE require admin auth

## Key Development Commands

### Server Management

```bash
npm run dev          # Development with nodemon
npm start           # Production server start
npm run ops:backup  # Database backup to CSV
```

### Testing Workflows

```bash
npm test                    # Full test suite with memory DB
npm run test:integration   # Live API integration tests
npm run test:child-users   # Specific child user tests
npm run test:prod         # Production server tests
npm run test:coverage     # Coverage reports
```

### Database Operations

```bash
node scripts/createSuperAdmin.js  # Bootstrap admin system
node utils/backupDB.js            # Manual database backup
```

### API Testing

```powershell
# Test waitlist endpoint
$body = @{ email = "test@example.com"; name = "Test User" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3333/api/waitlist" -Method POST -Body $body -ContentType "application/json"
```

## Critical Implementation Details

### Error Handling

- **Global JSON Parser**: Custom middleware in `src/middleware/jsonParser.js` for malformed JSON
- **Validation Errors**: Joi validation returns structured error objects
- **Auth Failures**: Return `401` with `{ message: "No token" }` for missing JWT
- **Duplicate Handling**: MongoDB duplicate key errors (code 11000) return `409 Conflict`

### Security Implementation

- **Password Hashing**: bcrypt with 10 salt rounds (never store plain text)
- **JWT Secrets**: Environment variable `JWT_SECRET` for token signing
- **CORS Origins**: Whitelist includes `https://admin.watchforme.com`, `http://localhost:5173`
- **Helmet**: CSP with specific directives for Swagger UI compatibility
- **Public Endpoints**: Waitlist POST endpoint is intentionally public for email collection

### MongoDB Connection

```javascript
// Standard connection pattern
const MONGODB_URI = `mongodb+srv://${user}:${password}@${host}/${dbName}?tls=true&authSource=admin&replicaSet=${replicaSet}`;
mongoose.connect(MONGODB_URI, { tls: true, retryWrites: true, w: "majority" });
```

### Swagger Documentation

- **Endpoint**: `/docs` serves interactive API documentation
- **Schema Files**: `src/swagger/swagger*Map.js` files define OpenAPI schemas
- **Production URL**: Update server URLs in `src/swagger/index.js` for deployment
- **Waitlist Docs**: `swaggerWaitlistMap.js` includes public and admin endpoint documentation

## Environment Variables

```bash
# Required for development
MONGODB_USER=api
MONGODB_PASSWORD=[production_password]
MONGODB_HOST=[atlas_cluster_url]
MONGODB_DBNAME=KidPro
JWT_SECRET=[secure_random_string]
NODE_ENV=production
```

## Common Integration Points

- **Admin Dashboard**: Vue.js client expects specific JSON response formats
- **Nginx Config**: Reverse proxy routes require exact path matching in `/etc/nginx/sites-available/`
- **SSL Certificates**: Auto-renewal via certbot for Let's Encrypt certificates
- **Process Management**: PM2 with ecosystem file for production deployment
- **Email Collection**: Waitlist system ready for integration with email marketing platforms
