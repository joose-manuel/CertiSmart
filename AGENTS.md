# AGENTS.md

Nx 16.10 monorepo: `apps/back` (NestJS 10 → Render) + `apps/front` (Angular 16 → Vercel).

## Commands

```bash
npm run back            # API on :3000/api  (watch)
npm run front           # Angular dev server on :4200
npm run build:back      # -> dist/apps/back/main.js
npm run build:front     # -> dist/apps/front/browser
npm run build           # both
npm run start:back      # run compiled backend (prod-like)
```

- **There are no `test` and no `lint` targets.** Only `build` and `serve` exist. Don't invent
  `npm test` / `nx lint` commands or add them to docs without creating the targets first.
- Only verification that actually works today: `npx nx build back` / `npx nx build front`.
- Node: `engines` says `18.x`, local machine runs 22.x. Builds work on 22; the warning is
  harmless. No nvm/bun/pnpm/yarn on this machine — npm only.
- **Always `npm install --legacy-peer-deps`** — plain install fails on peer resolution with this
  Angular 16 / Nx 16 / Nest 10 combination.

## Frontend: ngx-env builder (do not revert)

`apps/front/project.json` uses `@ngx-env/builder:browser` and `@ngx-env/builder:dev-server`,
**not** `@angular-devkit/build-angular`. This is deliberate: it is what injects `NG_APP_*` vars
into the bundle. Swapping back to the Angular builder silently drops env injection.

- Only vars prefixed `NG_APP_` are injected. Read them in code via
  `import.meta.env.NG_APP_*` (`src/environments/environment.ts`).
- Priority: real `process.env` **wins over** `apps/front/.env`. That's how Vercel injects
  Production/Preview vars at build time.
- `environment.prod.ts` was **deleted** and `fileReplacements` removed. Single `environment.ts`
  branches on `import.meta.env.NG_APP_ENV`. Don't re-add the fileReplacements pattern.
- Gotcha: typings must live in `src/env.d.ts`, **not** `src/.env.d.ts`. TypeScript does not pick
  up dotfiles via the `src/**/*.d.ts` include glob, so `import.meta.env` fails to compile.

## Backend: build config is load-bearing

`apps/back/project.json` sets `rootDir: apps/back/src` **and** `outputFileName: main.js` on the
`@nx/js:tsc` executor. Without them the executor nests output as
`dist/apps/back/src/main.js` and `@nx/js:node` / `npm run start:back` resolve the wrong path.
Don't remove either option.

- `ConfigModule` `envFilePath` entries (`apps/back/.env`, `.env`) are **cwd-relative** → run back
  commands from the repo root, not from `apps/back`.
- `PORT` is read as a string from env and must stay wrapped in `Number(...)`. A raw string port
  makes `app.listen` treat it as a pipe path, not a port.

## Deploy

- `render.yaml` (Blueprint): start `npm run start:back`, health check `/api/health`. Render
  injects `PORT` — do not define it there. Set `CORS_ORIGINS` to the real Vercel URL.
- `vercel.json`: output `dist/apps/front/browser`; set `NG_APP_API_URL` to the Render URL in the
  Vercel dashboard.
- Changing either public URL means updating it in **both** places (Render CORS ↔ Vercel env).

## Conventions

- No npm workspaces. Single root `node_modules`; every dependency is declared in the **root**
  `package.json`. Adding a dep = edit root `package.json`, never `apps/*/package.json`.
- Workspace was scaffolded by hand, **not** via Nx generators. `project.json` files are the
  source of truth; generators are not part of the workflow.

### Frontend component structure (required)

User-mandated rules for every component — no exceptions:

1. Components must be reusable; no logic/HTML inlined into parents.
2. Each component is its **own folder** containing: the component `.ts`, a separate template
   `.html`, a separate `.css`, plus its own `.service.ts`, `.constants.ts` and `.interface.ts`.
   Naming: `header/header.component.ts`, `header.component.html`, `header.component.css`,
   `header.service.ts`, `header.constants.ts`, `header.interface.ts`.
3. Use **PrimeNG** for UI. ⚠️ `primeng` / `primeicons` are **not installed yet** — install
   `primeng@16` + `primeicons@6` and wire the theme + PrimeNG modules into `app.module.ts` /
   `styles.css` before adding the first PrimeNG component.

### Git

- Branches `main`, `stg`, `dev`, `feature/CertiSmart` are all kept in sync at the same commit.
  Do work on `dev`, then fast-forward the others (`git branch -f <b> dev && git push`).
- `apps/*/.env` are gitignored; only `.env.example` is tracked. Never commit a real `.env`.