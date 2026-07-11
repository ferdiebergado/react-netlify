# backend-functions — Backend & Netlify Functions agent skill

Purpose: Guidance for editing and adding server-side code: Netlify Functions, Edge Functions, and backend helpers.

Quick Commands

- Dev (local): `pnpm dev` — uses `netlify dev -c vite` to run functions and edge middleware locally.
- Typecheck: `pnpm run typecheck` — runs `tsc -b` across referenced projects.
- Build: `pnpm build` — runs `tsc -b && vite build` (functions are transpiled via tsc).

Where to look

- Netlify Functions (Node): [netlify/functions](netlify/functions) — handlers exported for Netlify.
- Edge middleware: [netlify/edge-functions](netlify/edge-functions) — lightweight edge handlers and shared edge utils.
- Backend helpers and services: [backend](backend) — DB setup, auth repos, session services.
- Shared types & schemas: [shared](shared) — types consumed by functions and frontend.
- Netlify config: [netlify.toml](netlify.toml) — routing, edge functions mapping, and headers.

TypeScript & runtime notes

- Use `tsconfig.backend.json` for Node-targeted functions and `tsconfig.edge.json` for edge code.
- Functions run under Node (Netlify Functions) or Edge runtime (V8-like). Avoid using Node-only APIs in edge code.
- When adding a function: create a new file in `netlify/functions/`, export a handler matching existing files, and add any required env var docs.

Secrets & environment

- Local dev requires env vars used by `backend` (DB, OAuth client IDs). Don't store secrets in repo; document required vars in a local `.env.example` if needed.

Conventions & tips for agents

- Prefer small, focused PRs for function changes (single responsibility per function).
- Run `pnpm run typecheck` before submitting changes; include minimal tests where practical.
- Link to `backend/auth` and `netlify/edge-functions/session.ts` for auth/session flow context.

If you want, I can also scaffold a function template and a checklist for adding new functions (tsconfig, export, tests, documentation).
