# AGENTS — Project instructions for AI coding agents

Purpose: Give AI coding agents the minimal, actionable knowledge to be productive in this repo.

Quick Commands

- dev: `pnpm dev` — runs Netlify Dev with Vite locally (`netlify dev -c vite`).
- build: `pnpm build` — runs `tsc -b` then `vite build`.
- preview: `pnpm preview` — `vite preview` to inspect production output.
- typecheck: `pnpm run typecheck` — runs `tsc -b`.
- lint: `pnpm run lint` — run repository lint rules.

Where code lives (important entry points)

- Frontend app: [src](src) — React + Vite UI, pages and components.
- Serverless functions: [netlify/functions](netlify/functions) — Netlify Functions (Node).
- Edge middleware: [netlify/edge-functions](netlify/edge-functions) — Netlify Edge Functions.
- Backend helpers: [backend](backend) — DB, auth services used by functions.
- Shared types/schemas: [shared](shared) — cross-target types and validation.

TypeScript configuration

This repo uses project-referenced tsconfig setup. Key configs:

- [tsconfig.json](tsconfig.json) — root project references.
- [tsconfig.app.json](tsconfig.app.json) — frontend/Vite target.
- [tsconfig.backend.json](tsconfig.backend.json) — node/functions target.
- [tsconfig.edge.json](tsconfig.edge.json) — edge functions target.

Netlify notes

- See [netlify.toml](netlify.toml) for redirects, edge function mappings, and security headers.
- `netlify dev` is used in local development; ensure `netlify-cli` is installed.

Agent conventions & guidance

- Link, don't copy: Prefer linking to existing docs and code. Avoid duplicating large docs.
- Minimal changes: When modifying files, make small, focused edits consistent with existing style.
- Typecheck first: Run `pnpm run typecheck` before builds.
- Targets: Remember there are three runtime targets — browser (frontend), Node (functions), Edge (edge-functions). Use the matching tsconfig when reasoning about runtime APIs.

Common places to check for behavior

- Auth flows: `backend/auth`, `netlify/functions/*`, and `netlify/edge-functions/session.ts`.
- DB/test helpers: `tests` and `backend/db.ts`.

Suggested next customizations (optional)

- Frontend agent skill: shortcuts for common UI edits, component patterns in `src/components`.
- Backend/functions skill: steps for adding a Netlify Function and wiring tsconfig and exports.

If you'd like, I can also add a `.github/copilot-instructions.md` variant or create the frontend/backend agent skills next.
