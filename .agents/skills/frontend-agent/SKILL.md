# frontend-agent — Frontend coding agent skill

Purpose: Shortcuts and conventions for editing the React/Vite frontend.

Quick commands

- `pnpm dev` — run the app locally through Netlify Dev.
- `pnpm build` — typecheck and build the production bundle.
- `pnpm run typecheck` — validate the frontend TypeScript target.
- `pnpm run lint` — run repository lint rules.

Where to look

- Start with [README.md](README.md) for setup, OAuth, Turso/libSQL, and Netlify deployment details.
- App entry and pages: [src](src) and [src/pages](src/pages).
- Components: [src/components](src/components) and [src/components/ui](src/components/ui).
- Client-side hooks and API helpers: [src/lib](src/lib) and [src/auth](src/auth).
- Theme and styling: [src/theme](src/theme), [src/index.css](src/index.css), and [public/theme.js](public/theme.js).

TypeScript and build notes

- Use [tsconfig.app.json](tsconfig.app.json) for frontend-specific expectations.
- Keep changes minimal and preserve the project-referenced layout.
- Run `pnpm run typecheck` after TypeScript edits.
- Frontend code targets browser DOM APIs; avoid Node-only globals.

Conventions and tips

- Prefer existing component patterns in [src/components/ui](src/components/ui).
- When changing auth or session behavior, review [netlify/functions/oauthcallback.ts](netlify/functions/oauthcallback.ts) and [netlify/edge-functions/session.ts](netlify/edge-functions/session.ts).
- For local setup, copy [.env.example](.env.example) to [.env](.env) and fill in the required values first.
