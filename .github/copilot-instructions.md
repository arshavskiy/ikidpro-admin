# Javascript"

This project uses JavaScript with the following styles:

- All models will be classes with singular naming (i.e. `User` for the `users` table)
- All code files will be lower case with underscores.
- Markdown files will be lower case with hyphens.
- All application logic will go in the `lib` directory
- All configuration will be done with environment variables, using a `.env` file.
- Do not export a class directly, use module method instead to create the instance you need (aka \"factory\")

## Sequelize"

All model code should adhere to the following:

- All database models will go in a `db/models` directory.
- Every model will have a `tableName` setting"
- The models will have an `index.js` module that instantiates Sequelize, using SQLite for testing and development, Postgres for production.
- The `index.js` module will export each model, as well as the database instance.

Every model will follow the pattern:

- js
- const { DataTypes, Model } = require('sequelize');",
- class User extends Model

exports.init = function(sequelize)

# KidPro API - AI Coding Agent Instructions

## Database"

- Database tables will be lower cased using underscores.
- Every table will have an integer primary key called `id`.
- `users` will not store passwords, only social login information as well as magic email links.
- `char`, `varchar` and `nvarchar` are never to be used for string fields, only `text`.
- Every table should have `created_at` and `updated_at` timestamps.",
- Many to Many relationships will have compound primary keys, never a single ID with compound unique.

## Architecture Overview

**KidPro API** is a comprehensive Node.js/Express REST API for child monitoring and safety tracking, deployed in production with nginx reverse proxy and SSL termination.

### Core Components

- **Event Data System**: Biometric sensor data collection via `/api/event/*` (MongoDB: `child_events_db`)
- **User Management**: Parent authentication via `/api/user/*` + `/api/auth/*` (MongoDB: `user_reg_db`)
- **Child Profiles**: Child user management via `/api/child-users/*` (MongoDB: `child_info_db`)
- **Admin Panel**: Role-based admin system via `/api/admin/*` (MongoDB: `admin`)
- **Waitlist System**: Email collection for product updates via `/api/waitlist` (MongoDB: `emailing_list`)

### Production Environment

- **Domain**: `https://api.watchforme.com` (primary API) + `https://admin.watchforme.com` (admin panel)
- **Reverse Proxy**: nginx with Let's Encrypt SSL certificates (`/etc/letsencrypt/live/watchforme.com/`)
- **Database**: MongoDB Atlas cluster with replica set configuration
- **Server**: DigitalOcean droplet with PM2 process management

## Development Patterns

### ES Modules Architecture

- **Import style**: `import { router } from "./routes/event.js"` (never CommonJS)
- **File extensions**: Always use `.js` extensions in imports
- **Package.json**: `"type": "module"` - entire project uses ES modules

### Authentication Flow

```javascript
// Standard pattern for protected routes
import auth from "../middleware/auth.js";
router.get("/protected", auth, controller.method);

// Admin routes use separate auth
import { adminAuth, superAdminOnly } from "../middleware/adminAuth.js";
router.get("/admin-only", adminAuth, superAdminOnly, controller.method);

// Public routes (like waitlist) don't require auth
router.post("/public", controller.method);
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
