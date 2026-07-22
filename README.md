# Mini Device Catalog

A small Nuxt SSR device catalog built for the Middle Fullstack Developer take-home assignment.

The project contains a two-page catalog application and a short website review in `AUDIT.md`.

## Stack

- Nuxt 4
- Vue 3
- TypeScript
- Nitro server routes
- Zod
- SCSS modules
- CSS custom properties

## Setup

```bash
npm install
npm run dev
```

The application runs locally at:

```txt
http://localhost:3000
```

## Useful scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

`npm run typecheck` runs `vue-tsc --noEmit` and checks TypeScript/Vue types without generating files.

Recommended `package.json` scripts:

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

## Project structure

```txt
app/
  app.vue
  assets/
    styles/
      main.scss
      tokens.scss
  components/
    catalog/
      CatalogState.vue
      CatalogState.module.scss
      DeviceCard/
      DeviceFilters/
      DeviceGrid/
      Pagination/
    theme/
      ThemeToggle.vue
      ThemeToggle.module.scss
  composables/
    useDeviceQuery.ts
    useTheme.ts
  pages/
    index.vue
    index.module.scss
    devices/
      [slug].vue
      [slug].module.scss
  error.vue
  error.module.scss

server/
  api/
    devices.get.ts
    devices/
      [slug].get.ts
  utils/
    device-query.ts
    devices.ts

shared/
  data/
    devices.json
  schemas/
    device.ts

public/
  img/

ai/
  plan.md
  prompts.md
```

## Features

- Server-side rendered catalog listing page.
- Dynamic device detail page.
- Server-side filtering by brand.
- Server-side price range filtering.
- Server-side sorting by price.
- Out-of-stock devices are pushed to the end of the list.
- Artificial pagination to demonstrate paginated catalog behavior with a small dataset.
- Filter, sort and pagination state is reflected in the URL.
- Loading, empty and error states.
- Custom not-found/error page.
- Light/dark theme toggle.
- Responsive product grid.
- Local `.webp` product images.
- Image fallback for missing assets.
- Keyboard-operable filters and visible focus states.

## SSR

Nuxt SSR is enabled by default.

The listing page and detail page use `await useAsyncData(...)`, so the initial HTML is rendered with data already fetched on the server.

The catalog page fetches devices from the Nitro API:

```ts
await useAsyncData<DevicesResponse>(
  'devices-catalog',
  () => $fetch('/api/devices', { query: apiQuery.value }),
  {
    watch: [apiQuery],
  }
)
```

The device detail page fetches a single device by slug:

```ts
await useAsyncData<Device>(
  `device-${slug.value}`,
  () => $fetch(`/api/devices/${slug.value}`)
)
```

## Data layer

Catalog data is served through Nitro routes:

```txt
GET /api/devices
GET /api/devices/:slug
```

Filtering, sorting, pagination and query validation are handled on the server side, not in the browser.

The shared contract lives in:

```txt
shared/schemas/device.ts
```

Zod is used to validate device data and query params. TypeScript types are inferred from the schemas to avoid duplicating contracts.

## URL-driven filters

The URL is the source of truth for catalog state.

Examples:

```txt
/?brand=Apple
/?brand=Apple&brand=Samsung
/?minPrice=1000&maxPrice=10000
/?sort=price-desc
/?page=2&perPage=8
```

Opening or sharing one of these URLs reproduces the same filtered server request.

## Component architecture

`DeviceCard` is the reusable, themeable component designed as if it could be moved to a shared component library.

It has:

- an explicit props contract;
- isolated SCSS module styles;
- no dependency on page-level fetching;
- colors controlled through CSS custom properties;
- accessible link semantics;
- meaningful product image alt text.

Runtime props are currently used in a few Vue components because the local dependency setup had trouble resolving imported prop interfaces inside `defineProps<T>()`.

The typed contracts are still kept next to the components and can be restored after dependency cleanup.

## Theming

The UI uses CSS custom properties from:

```txt
app/assets/styles/tokens.scss
```

A light/dark toggle demonstrates the theme layer.

Component styles reference variables such as:

```txt
--color-bg
--color-surface
--color-text
--color-border
--color-primary
```

instead of hard-coded theme colors.

## Accessibility and performance notes

- Form controls are keyboard-operable.
- Filters use semantic form structure.
- Focus states are visible.
- Product images include meaningful `alt` text.
- Listing images use lazy loading.
- Detail page image is loaded eagerly because it is the main content of the page.
- The page keeps scrollbar space stable to avoid layout shift during client-side refetches.
- No full UI kit is used.

## Trade-offs

- Pagination is artificial because the seed dataset has only 16 devices.
- Product images are generated local `.webp` placeholders that match the supplied JSON paths.
- No Pinia store was added because URL query params are enough for this scope.
- No i18n was added because the core requirements were prioritized.
- Runtime props are used temporarily in some components due to local dependency issues with imported `defineProps<T>()` types.
- A native `select` is used for sorting. It keeps accessibility and browser behavior simple, even though the opened dropdown is styled by the operating system.

## AI usage

AI was used to clarify the assignment, plan the project structure, review implementation trade-offs, generate UI/code snippets, and create local placeholder product images.

The AI-related notes are committed in:

```txt
ai/plan.md
ai/prompts.md
```

All code was reviewed, adjusted and integrated manually.

## What I would improve with more time

- Restore imported `defineProps<T>()` contracts after dependency cleanup.
- Add component tests with Vitest.
- Add server-route tests for query validation.
- Add RO/RU localization.
- Improve product imagery with real assets.
- Add a custom accessible listbox only if the design required fully custom dropdown styling.
