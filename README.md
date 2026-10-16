# CertiSmart

Monorepo **Nx** con **Angular 16** (frontend) y **NestJS 10** (backend).
Preparado para desplegar el backend en **Render** y el frontend en **Vercel**.

## Estructura

```
.
├── apps
│   ├── back            # API NestJS  -> Render
│   │   ├── .env.example
│   │   └── src
│   └── front           # App Angular -> Vercel
│       ├── .env.example
│       └── src
├── nx.json
├── package.json
├── render.yaml         # Blueprint de deploy backend (Render)
└── vercel.json         # Config de deploy frontend (Vercel)
```

## Requisitos

- Node.js 18.x (recomendado)
- npm 9+

## Instalación

```bash
npm install
```

Crea los `.env` locales a partir de los ejemplos (no se versionan):

```bash
copy apps\back\.env.example apps\back\.env
copy apps\front\.env.example apps\front\.env
```

## Desarrollo

```bash
npm run back     # API NestJS  -> http://localhost:3000/api
npm run front    # Angular 16  -> http://localhost:4200
```

## Build

```bash
npm run build          # build de front + back
npm run build:front    # frontend -> dist/apps/front/browser
npm run build:back     # backend  -> dist/apps/back
npm run start:back     # ejecuta el backend compilado (producción)
```

## Variables de entorno

Cada app tiene su propio archivo `.env` (ignorado por git). Versionamos solo
los `.env.example`.

### Backend — `apps/back/.env`

| Variable       | Descripción                                             | Ejemplo                                    |
| -------------- | ------------------------------------------------------- | ------------------------------------------ |
| `NODE_ENV`     | Entorno de ejecución                                    | `development`                              |
| `PORT`         | Puerto HTTP (Render lo inyecta en producción)           | `3000`                                     |
| `API_PREFIX`   | Prefijo global de la API                                | `api`                                      |
| `CORS_ORIGINS` | Orígenes CORS permitidos (coma) o `*`                   | `http://localhost:4200,https://app.vercel.app` |

Cargados con `@nestjs/config` desde `apps/back/.env` (o variables reales del sistema).

### Frontend — `apps/front/.env`

| Variable          | Descripción                                    | Ejemplo                     |
| ----------------- | ---------------------------------------------- | --------------------------- |
| `NG_APP_ENV`      | Entorno (`development` / `staging` / `production`) | `development`           |
| `NG_APP_API_URL`  | URL base del backend                           | `http://localhost:3000/api` |

Solo se inyectan las variables con prefijo **`NG_APP_`** (regla de `@ngx-env/builder`).
Se usan en el código vía `import.meta.env.NG_APP_*` (ver `apps/front/src/environments/environment.ts`).

## Deploy

### Backend en Render

`render.yaml` es un **Blueprint**. En Render: **New + → Blueprint**, apunta al repo y despliega.

- Build: `npm install --legacy-peer-deps && npm run build:back`
- Start: `npm run start:back` (`node dist/apps/back/main.js`)
- Health check: `/api/health`

Variables a configurar en el dashboard de Render (las del `render.yaml` ya salen por defecto):
`NODE_ENV=production`, `API_PREFIX=api`, `CORS_ORIGINS=https://TU-FRONT.vercel.app`.
`PORT` lo inyecta Render automáticamente.

### Frontend en Vercel

Importa el repo en Vercel (framework: **Other**). `vercel.json` ya define:
build `npx nx build front --configuration=production` y output `dist/apps/front/browser`.

Configura en **Settings → Environment Variables** (Production/Preview):

- `NG_APP_API_URL` = URL pública del backend en Render (p. ej. `https://certismart-back.onrender.com/api`)
- `NG_APP_ENV` = `production` (ya forzado en `vercel.json`)

> Tras desplegar el backend, actualiza `CORS_ORIGINS` en Render con la URL real de Vercel
> y `NG_APP_API_URL` en Vercel con la URL real de Render.

## Ramas

- `main` — producción
- `stg` — staging
- `dev` — desarrollo
- `feature/CertiSmart` — rama de cambios
