# CertiSmart

Monorepo Nx con **Angular 16** (frontend) y **NestJS** (backend).

## Estructura

```
.
├── apps
│   ├── back        # API NestJS  -> Render
│   └── front       # App Angular -> Vercel
├── nx.json
├── package.json
├── render.yaml     # deploy backend (Render)
└── vercel.json     # deploy frontend (Vercel)
```

## Requisitos

- Node.js 18.x (recomendado) o superior
- npm 9+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run back     # levanta la API en http://localhost:3000/api
npm run front    # levanta la app Angular en http://localhost:4200
```

## Build

```bash
npm run build          # build de front + back
npm run build:front    # solo frontend  -> dist/apps/front/browser
npm run build:back     # solo backend   -> dist/apps/back
npm run start:back     # ejecuta el backend compilado
```

## Deploy

### Backend (Render)

El archivo `render.yaml` es un Blueprint. En Render: **New + > Blueprint**, apunta al repo
y despliega. Build: `npx nx build back` · Start: `node dist/apps/back/main.js`.

### Frontend (Vercel)

Importa el repo en Vercel. El `vercel.json` ya define:
build `npx nx build front --configuration=production` y output `dist/apps/front/browser`.

> Ajusta `apiUrl` en `apps/front/src/environments/environment.prod.ts` con la URL real del backend en Render.

## Ramas

- `main` — producción
- `stg` — staging
- `dev` — desarrollo
- `feature/CertiSmart` — rama de cambios
