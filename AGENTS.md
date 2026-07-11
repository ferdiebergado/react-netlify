# AGENTS — Project instructions for AI coding agents

Purpose: Help coding agents work effectively in this repository without duplicating the existing docs.

Quick commands

- `pnpm dev` — run the app locally through Netlify Dev.
- `pnpm build` — run TypeScript builds and Vite production build.
- `pnpm run typecheck` — run the referenced TypeScript projects.
- `pnpm test` — run the Vitest suite.
- `pnpm run db:migrate` — initialize the local database from [init.sql](init.sql).

Key docs to read first

- [README.md](README.md) — setup steps, Google OAuth, Turso/libSQL guidance, and Netlify deployment notes.
- [.env.example](.env.example) — required environment variables.
- [netlify.toml](netlify.toml) — redirects, edge-function mappings, and headers.

Architecture at a glance

- Frontend: [src](src) for React/Vite pages, components, hooks, and theme code.
- Functions: [netlify/functions](netlify/functions) for Netlify Functions.
- Edge: [netlify/edge-functions](netlify/edge-functions) for session, CSRF, JSON, and CSP middleware.
- Backend: [backend](backend) for auth, database access, and shared services.
- Shared: [shared](shared) for cross-target types and schemas.

Conventions

- Prefer small, focused changes and keep the runtime target in mind: browser, Node, or edge.
- Link to the existing docs instead of copying large sections into new instructions.
- Run `pnpm run typecheck` after TypeScript changes.
- Local development requires values from [.env](.env); production may use Turso/libSQL plus Google OAuth.

Common areas to inspect

- Auth flow: [backend/auth](backend/auth), [netlify/functions/signin.ts](netlify/functions/signin.ts), [netlify/functions/oauthcallback.ts](netlify/functions/oauthcallback.ts), and [netlify/edge-functions/session.ts](netlify/edge-functions/session.ts).
- Database access: [backend/db.ts](backend/db.ts) and [tests/db.ts](tests/db.ts).
