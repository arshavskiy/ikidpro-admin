# API URL Configuration for Production Builds

This document explains how the API URL configuration works for different environments.

## Configuration Overview

The application now automatically switches between different API endpoints based on the build environment:

- **Development**: Uses `http://localhost:3333` via Vite proxy
- **Production**: Uses `https://api.watchforme.com`

## Files Modified

### 1. `vite.config.js`

- Configured proxy for development server to route `/api` requests to `localhost:3333`
- Removed complex environment-based configuration in favor of simpler approach

### 2. `src/services/apiClient.js`

- Updated to dynamically determine API base URL based on environment
- In development: uses `/api` (handled by Vite proxy)
- In production: uses `https://api.watchforme.com/api`
- Added logging for debugging API configuration

### 3. Environment Files

#### `.env` (Development)

```env
VITE_API_URL=http://localhost:3333
VITE_APP_ENV=development
```

#### `.env.production` (Production)

```env
VITE_API_URL=https://api.watchforme.com
VITE_APP_ENV=production
```

#### `.env.example` (Template)

- Template file showing required environment variables
- Safe to commit to version control

### 4. `.gitignore`

- Added environment files to prevent sensitive data from being committed
- Excludes `.env`, `.env.local`, `.env.development`, `.env.production`

## How It Works

### Development Mode (`npm run dev`)

1. Vite starts development server with proxy configuration
2. API requests to `/api/*` are proxied to `http://localhost:3333`
3. `apiClient.js` detects development mode and uses `/api` as base URL
4. All requests go through the proxy to the local backend

### Production Build (`npm run build`)

1. Vite builds the application for production
2. Environment variables from `.env.production` are used
3. `apiClient.js` detects production mode and uses full API URL
4. API requests go directly to `https://api.watchforme.com/api`

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Variable Usage

The configuration uses Vite's environment variable system:

- Variables prefixed with `VITE_` are available in the browser
- `import.meta.env.DEV` detects development mode
- `import.meta.env.VITE_API_URL` gets the API URL from environment

## Benefits

1. **Automatic Switching**: No manual configuration needed for different environments
2. **Secure**: Environment files with sensitive data are not committed
3. **Flexible**: Easy to change API endpoints via environment variables
4. **Debug-Friendly**: Console logging shows current API configuration
5. **Proxy Support**: Development proxy eliminates CORS issues

## Deployment Notes

For production deployment:

1. Ensure `.env.production` file is present with correct API URL
2. Build process will automatically use production environment variables
3. Built files in `dist/` directory will contain the production API configuration
4. No additional configuration needed on the server side
