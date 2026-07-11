# frontend-agent — Frontend coding agent skill

Purpose: Shortcuts and conventions for editing the React/Vite frontend.

Quick Commands

- Dev: `pnpm dev` — runs `netlify dev -c vite` for local development.
- Build: `pnpm build` — runs `tsc -b && vite build`.
- Typecheck: `pnpm run typecheck` — `tsc -b` (run before builds).
- Lint: `pnpm run lint`.

Where to look

- App entry & pages: [src](src) and [src/pages](src/pages).
- Components: [src/components](src/components) and [src/components/ui](src/components/ui).
- Client-only hooks and API: [src/lib](src/lib) and [src/auth](src/auth).
- Styles: [src/index.css](src/index.css) and component styles in `src`.

TypeScript & build notes

- Use `tsconfig.app.json` for frontend-specific type expectations.
- Keep changes minimal and preserve project-referenced layout. Run `pnpm run typecheck` after TS edits.
- Frontend code targets browser DOM APIs; avoid Node-only globals.

Testing & local verification

- Manual smoke: run `pnpm dev`, visit `http://localhost:8888` (Netlify Dev default).
- Prefer small component changes + quick page checks rather than end-to-end overhauls.

Conventions & tips for agents

- Link to existing files instead of copying large docs.
- When adding components, prefer patterns in `src/components/ui/*.tsx`.
- For visual changes, mention `theme/` files under `src/theme` and `public/theme.js`.
- When modifying imports, use path aliases consistent with tsconfig.

If you'd like, I can add code generation helpers for common UI patterns (button, field, card).
