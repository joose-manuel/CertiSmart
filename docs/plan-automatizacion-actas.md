# Plan simple: Excel → JSON → PDF de actas (SIN base de datos)

> Versión simple del plan. Se reemplaza el plan anterior (que incluía fases con Postgres,
> colas y verificación online) por este: solo lo necesario para que funcione.

---

## 1. Qué hace el sistema

1. El front sube el Excel con la lista de estudiantes.
2. El back lo lee y devuelve el JSON ya validado.
3. El wizard muestra/edita/selecciona los estudiantes (como ya hace hoy, en memoria del front).
4. El front envía los seleccionados + la configuración del acta.
5. El back genera **un PDF por estudiante** con la plantilla del acta y devuelve un **ZIP**.

**Sin base de datos. Sin estado en el servidor.** Cada request es independiente; si se
refresca el navegador se vuelve a subir el Excel (aceptable para este alcance).

---

## 2. Decisiones

| Tema | Decisión |
|------|----------|
| Base de datos | **Ninguna.** No se guarda nada |
| Parseo del Excel | En el back con `exceljs` (**solo `.xlsx`**; se quita `.csv`/`.xls` del front) |
| Generación de PDF | En el back con **`pdfmake`**: ligero, sin Chromium, rápido en lote (40+ actas en <3 s) |
| Plantilla del PDF | Definida en código (un archivo del back que replica el diseño que **ya existe** en la vista previa del wizard: encabezado, título, cuerpo, firmas, folio, QR, marca de agua) |
| Verificación QR | Sin endpoint: el QR codifica un texto `folio | código | hash`. Verificación offline, sin persistencia |
| Estado del lote | El front ya lo tiene en memoria (el wizard). El back no necesita guardarlo |

---

## 3. Librerías (las mínimas)

| Paquete | Uso |
|---------|-----|
| `exceljs` | Leer el Excel subido + generar la plantilla descargable |
| `pdfmake` | Generar los PDF de las actas |
| `archiver` | Empaquetar el ZIP en streaming |
| `qrcode` | Generar el QR (según la config del acta) |
| `class-validator` + `class-transformer` | Validar los datos que llegan a los endpoints |
| `@types/multer`, `@types/archiver`, `@types/qrcode` (dev) | Tipados |

Instalar como siempre: `npm install --legacy-peer-deps` desde la raíz.

---

## 4. Estructura mínima del back

```
apps/back/src/app/
├── nominas/
│   ├── nominas.module.ts
│   ├── nominas.controller.ts        # GET /plantilla, POST /nominas/parsear
│   ├── nominas.service.ts           # valida filas (mismas reglas del front)
│   ├── excel-parser.service.ts      # exceljs → Estudiante[]
│   └── plantilla-excel.service.ts   # genera Plantilla_Oficial_CertiSmart.xlsx
├── actas/
│   ├── actas.module.ts
│   ├── actas.controller.ts          # POST /actas/preview, POST /actas/generar
│   ├── actas.service.ts             # folios, hash, armado del acta, ZIP
│   └── pdf/
│       ├── pdf.service.ts           # pdfmake → Buffer
│       └── plantilla-acta.ts        # la constancia de notas (réplica de la plantilla Word)
└── common/
    ├── constants/actas.constants.ts # institución, autoridades (espejo del front)
    └── utils/archivo-nombre.util.ts # formatos de nombre de archivo
```

---

## 5. APIs (4 endpoints y ya)

Prefijo actual: `/api`.

| # | Método y ruta | Entrada | Salida | Uso en el wizard |
|---|---------------|---------|--------|------------------|
| 1 | `GET /api/plantilla` | — | `Plantilla_Oficial_CertiSmart.xlsx` | Botón "Descargar plantilla" del paso Carga |
| 2 | `POST /api/nominas/parsear` | multipart `archivo` (`.xlsx`, ≤25 MB) | `{ resumen: { total, validos, errores }, estudiantes: Estudiante[] }` — cada fila con `estado` y `errores` | Paso Carga → el wizard pasa a Validación con datos reales |
| 3 | `POST /api/actas/preview` | `{ estudiante, config }` | 1 PDF (`application/pdf`) | Botón "Descargar muestra" del paso Plantilla |
| 4 | `POST /api/actas/generar` | `{ estudiantes: Estudiante[], config, formatoNombre }` | **ZIP** con un PDF por estudiante (si es 1 solo → PDF directo) | Botón de exportación del paso Exportación |

Errores en formato estándar: `{ statusCode, error: 'CODIGO', message, detalles? }` con 400
(`ARCHIVO_REQUERIDO`, `FORMATO_NO_SOPORTADO`, `ARCHIVO_CORRUPTO`, `SIN_FILAS`,
`SIN_ESTUDIANTES_SELECCIONADOS`, `CONFIG_INVALIDA`).

No hay `GET/DELETE` de nóminas porque no se guarda nada.

---

## 6. Flujo completo

```
Angular (wizard)                              NestJS (SIN estado)
  │ 1. Subir .xlsx ────────────────────────► FileInterceptor (memoria)
  │                                           exceljs → normaliza columnas
  │                                           valida filas → JSON
  │ ◄─── { resumen, estudiantes[] } ─────────┘
  │ 2. Editar / corregir / seleccionar (local, como hoy)
  │ 3. Configurar constancia: folioInicial, fecha, ciudad,
  │    QR, marca de agua, hash, formato de nombre
  │ 4. Descargar muestra ───────────────────► pdfmake → 1 PDF
  │ ◄─── CM-2026-00145_muestra.pdf ─────────┘
  │ 5. Generar constancias ────────────────► por estudiante:
  │                                           folio → hash (sha256) → QR → pdfmake
  │ ◄─── constancias_movilidad_2026-10-15.zip ┘ archiver (streaming, 1 PDF a la vez)
```

---

## 7. Reglas mínimas (todo espejo de lo que el front ya tiene)

- **Validación**: universidad, documento y nombre presentes; entre 1 y 3 asignaturas y nota
  numérica en `(0, 5]` o vacía (pendiente) — las mismas reglas de `validarEstudiante`
  (`estudiante.model.ts`). Filas con error no bloquean: vuelven marcadas y el wizard ya sabe
  mostrarlas y corregirlas.
- **Columnas**: el Excel real trae `UNIVERSIDAD`, `CC`, `NOMBRE ESTUDIANTE` y hasta 3 bloques
  `CÓDIGO DE ASIGNATURA / NOMBRE ASIGNATURA / NOTA` (12 columnas). Mapeo tolerante del
  encabezado (mayúsculas/acentos/espacios) contra `COLUMNAS_ESPERADAS`. Nota acepta `4,5` y
  `4.5`; celdas vacías → nota pendiente.
- **Folio**: `CM-2026-` + (`folioInicial + índice`), en el orden del archivo. 5 dígitos.
  Se muestra solo en el pie opcional.
- **Hash**: `sha256(folio|documento|nombre)` real con `node:crypto` — solo como texto al pie
  de la constancia (como el hash simulado actual, pero real).
- **Nombre de archivo**: los 2 formatos del front (`documento_nombre`, `folio_documento`),
  normalizados y sin duplicados.
- **QR**: si `config.codigoQr` → imagen (`qrcode`) con texto `folio|documento|hash`.
- **Marca de agua / hash del pie**: tal como las opciones del paso Plantilla (por defecto
  desactivadas, para clonar la plantilla Word).

---

## 8. La "plantilla" de la constancia — decidido

**Decisión tomada**: el diseño es la **carta oficial en Word** («CONSTANCIA DE NOTAS MOVILIDAD
ACADÉMICA», `docs/CONSTANCIA DE NOTAS MOVILIDAD ACADÉMICA.docx`). El front ya la replica en
`acta-preview.component.html` (franjas roja/gris, logo, Times New Roman, tabla de notas,
sello + firma + «JOSÉ DANIEL OSORIO OROZCO, MD»).

- **Opción A (elegida)**: el diseño se define una vez en `plantilla-acta.ts` (pdfmake)
  replicando esa vista previa. Las imágenes (logo, sello, firma) salen de
  `apps/front/src/assets/constancia/`; el back las recibirá en `apps/back/src/assets/constancia/`.
- **Opción B (descartada)**: usar un PDF fijo como fondo y escribir encima con `pdf-lib`.

---

## 9. Cambios necesarios en el front (los mínimos)

| Archivo | Cambio |
|---------|--------|
| `core/services/` (nuevo `nominas-api.service.ts` y `actas-api.service.ts`) | Las 4 llamadas HTTP (parsear, plantilla, preview, generar) |
| `step-upload.component.ts` | `subir()` → `POST /nominas/parsear` real (se quita el `setTimeout`); `descargarPlantilla()` → `GET /plantilla` |
| `acta-wizard.component.ts` | `onArchivoSeleccionado` usa la respuesta del back (ya no llama a `cargarDemo`) |
| `actas-store.service.ts` | Nuevo `cargarDesdeServidor(estudiantes)`; `cargarDemo()` se queda opcional |
| `step-template.component.ts` | `descargarMuestra()` → `POST /actas/preview` → descarga el PDF |
| `step-export.*` | Botón real: `POST /actas/generar` → descarga el ZIP (blob) |
| `core/constants/actas.constants.ts` | `EXTENSIONES_PERMITIDAS = ['.xlsx']` |

`environment.ts` ya tiene `apiUrl` — no se toca.

---

## 10. Fases (cortas y verificables)

| Fase | Alcance | Estimado | Criterio de aceptación |
|------|---------|----------|------------------------|
| **F1** | `POST /nominas/parsear` + `GET /plantilla` | 0.5–1 día | Subir un Excel de 50 estudiantes → JSON con `resumen` correcto; la plantilla descarga |
| **F2** | `POST /actas/preview` + `plantilla-acta.ts` (pdfmake) | 1 día | "Descargar muestra" baja 1 PDF fiel a la vista previa, con acentos correctos |
| **F3** | `POST /actas/generar` + ZIP + integración del paso Exportación | 0.5–1 día | Generar 50 actas desde el front en <10 s y descargar el ZIP |
| **F4 (opcional)** | QR real, pulido del diseño de la constancia | 0.5 día | QR visible y escaneable |

---

## 11. Fuera de alcance a propósito

DB, login/usuarios, verificación online de QR, historial de actas emitidas, colas, firma
digital. Todo eso se puede añadir después **sin rehacer** este diseño.

---

## 12. Cómo se verifica en este repo

- No existen targets `test`/`lint` (ver AGENTS.md). Se verifica con `npx nx build back` +
  pruebas manuales `curl` (multipart) contra `npm run back`.
- Fixture: un `nomina-demo.xlsx` generado una vez con `exceljs` (mismo código de la plantilla).

---

## 13. Nota técnica pequeña

`pdfmake` incluye las fuentes Roboto en el paquete: se referencian con
`require.resolve('pdfmake/package.json')` al construir el `PdfPrinter`. Es un detalle de
implementación de ~30 min, sin dependencias externas ni archivos que copiar.
