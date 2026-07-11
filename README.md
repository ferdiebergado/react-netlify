# React Netlify App

A modern React + TypeScript application deployed on Netlify with serverless functions, edge middleware, and authentication flows. The project combines a Vite-powered frontend with a Netlify-native backend layer for API routes, sessions, and secure edge handling.

## Features

- React 19 + TypeScript frontend with Vite and route-based pages
- Netlify Functions for server-side handlers such as sign-in, sign-out, OAuth callback, and user info
- Netlify Edge Functions for session handling, CSRF protection, JSON responses, and CSP headers
- Authentication flow with Google OAuth and session-backed user access
- Shared schemas and types between frontend, backend, and edge code
- Query caching and error boundaries via React Query and React Error Boundary
- Theme support with a lightweight theme provider and UI components
- Turso/libSQL database support for local development and production deployments

## Tech Stack

- Frontend: React, TypeScript, Vite, Wouter, TanStack Query
- UI: Tailwind-inspired component system, shadcn-style primitives, Sonner toasts
- Backend: Netlify Functions, Netlify Edge Functions, Node.js
- Data: Turso and libSQL-compatible database access, with local SQLite fallback
- Tooling: pnpm, TypeScript project references, Vitest, Oxlint, Netlify CLI

## Project Structure

- [src](src) — React app, pages, hooks, shared UI components, and auth client code
- [netlify/functions](netlify/functions) — serverless API handlers
- [netlify/edge-functions](netlify/edge-functions) — edge middleware and shared helpers
- [backend](backend) — auth, session, database, and service logic
- [shared](shared) — cross-target types, schemas, and constants
- [tests](tests) — database and test helpers

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Netlify CLI (installed automatically via the project dependencies)

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Copy the example environment file and set the required values before starting the app:

```bash
cp .env.example .env
```

Then edit [.env](.env) and fill in the required variables such as `APP_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.

### Set up the database

```bash
pnpm run db:migrate
```

### Start the development server

```bash
pnpm dev
```

This runs the app through Netlify Dev with Vite integration.

### Build for production

```bash
pnpm build
```

### Run type checks

```bash
pnpm run typecheck
```

### Run tests

```bash
pnpm test
```

## Deploy to Netlify

This project is designed to run on Netlify with the existing Vite frontend, Netlify Functions, and Edge Functions setup.

### 1. Connect the repository

- Create or open a site in Netlify.
- Link the GitHub repository that contains this project.
- Netlify will detect the Vite app automatically.

### 2. Configure build settings

Use these settings in the Netlify site configuration:

- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: `22`

### 3. Add environment variables

Set the following environment variables in Netlify Site Settings → Build & deploy → Environment:

```bash
HOST=https://<your-site>.netlify.app
DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-auth-token>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=https://<your-site>.netlify.app/api/oauthcallback
APP_KEY=<a-long-random-secret>
ENV=production
```

### 4. Deploy

Push to the connected branch and Netlify will build and deploy the app automatically.

### 5. Post-deploy checks

- Verify the site loads correctly.
- Confirm OAuth callback and sign-in flows work with the production redirect URI.
- Make sure the production database is reachable and the schema is applied.

## Production Database Setup (Turso)

This app can use a remote libSQL-compatible database such as Turso in production.

1. Create a database in Turso (dashboard or CLI).
2. Copy the database URL and set it in your production environment:

```bash
DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-auth-token>
ENV=production
```

3. Apply the schema from [init.sql](init.sql) to the new database using the Turso SQL shell or dashboard.
4. Restart your app or redeploy so the new environment variables are picked up.

If you are using the Turso CLI, the typical workflow is:

```bash
turso auth login
turso db create <your-db-name>
turso db show <your-db-name> --url
```

Then set the URL and token in your hosting platform's environment variables.

## Development Notes

- The repo uses TypeScript project references for separate browser, backend, and edge targets.
- Local development uses Netlify Dev, so routes and function behavior are closer to production than a standalone Vite app.
- Authentication and session behavior span both edge middleware and serverless handlers, so changes there should be tested carefully.

## Environment and Configuration

- [netlify.toml](netlify.toml) defines redirects, edge function mappings, and headers.
- [tsconfig.json](tsconfig.json) and the referenced configs control the build targets for frontend, backend, and edge runtime.
- [init.sql](init.sql) seeds the local SQLite database used by development and tests.

## Contributing

1. Create a focused change.
2. Run type checks and relevant tests before submitting.
3. Keep edits consistent with the existing folder structure and runtime targets.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.
