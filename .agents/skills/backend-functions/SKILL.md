# backend-functions — Backend & Netlify Functions agent skill

Purpose: Guidance for editing and adding server-side code: Netlify Functions, Edge Functions, and backend helpers.

Quick commands

- `pnpm dev` — run functions and edge middleware locally through Netlify Dev.
- `pnpm run typecheck` — validate the backend and edge TypeScript targets.
- `pnpm build` — run the shared build flow for the repository.

Where to look

- Start with [README.md](README.md) for setup, Google OAuth, Turso/libSQL, and deployment details.
- Netlify Functions (Node): [netlify/functions](netlify/functions).
- Edge middleware: [netlify/edge-functions](netlify/edge-functions).
- Backend helpers and services: [backend](backend).
- Shared types and schemas: [shared](shared).
- Netlify config: [netlify.toml](netlify.toml).

TypeScript and runtime notes

- Use [tsconfig.backend.json](tsconfig.backend.json) for Node-targeted functions and [tsconfig.edge.json](tsconfig.edge.json) for edge code.
- Functions run under Node or the edge runtime; avoid Node-only APIs in edge code.
- When adding a function, create a new file in [netlify/functions](netlify/functions) and keep the export shape consistent with existing handlers.

Environment and data notes

- Local development depends on values from [.env.example](.env.example) and [.env](.env).
- Production may use Turso/libSQL via [backend/config.ts](backend/config.ts); local development can also use a file-based SQLite URL.
- OAuth and session behavior span [netlify/functions/oauthcallback.ts](netlify/functions/oauthcallback.ts), [netlify/functions/signin.ts](netlify/functions/signin.ts), and [netlify/edge-functions/session.ts](netlify/edge-functions/session.ts).

Conventions and tips

- Keep changes small and focused on one runtime boundary at a time.
- Run `pnpm run typecheck` before submitting changes and add tests where practical.
