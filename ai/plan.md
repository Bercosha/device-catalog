# AI-assisted implementation plan

## Goal

Build a small but complete Nuxt SSR device catalog using the supplied `devices.json` seed data.

The implementation should stay close to the assignment scope: a two-page catalog application, server-side data handling, a reusable themeable component, and a short website review.

## Scope

### 1. Foundation

- Initialize a Nuxt project.
- Keep SSR enabled.
- Add TypeScript, Zod and SCSS support.
- Add shared style tokens and global styles.
- Keep the project structure compact.

### 2. Shared data contract

- Create `shared/schemas/device.ts`.
- Define the device schema.
- Define query parameter validation.
- Define the API response shape.
- Infer TypeScript types from Zod schemas.

### 3. Server data layer

- Store seed data in `shared/data/devices.json`.
- Validate the seed data before using it.
- Create `GET /api/devices`.
- Create `GET /api/devices/:slug`.
- Handle unknown device slugs with a 404 state.
- Apply filtering, sorting and pagination on the server.
- Push out-of-stock devices to the end of the list.

### 4. Catalog listing page

- Build an SSR listing page.
- Fetch data with `await useAsyncData`.
- Read catalog state from URL query params.
- Update query params when filters, sorting or pagination change.
- Add responsive product grid.
- Add loading, empty and error states.
- Avoid layout shift during client-side refetches.

### 5. Device detail page

- Build `/devices/[slug]`.
- Fetch one device by slug.
- Add SEO metadata: title, description and Open Graph tags.
- Add a readable product hero layout.
- Add image fallback.
- Use a custom error page for unknown routes or unknown device slugs.

### 6. Reusable component and theming

- Build `DeviceCard` as the reusable themeable component.
- Keep component styles isolated with SCSS modules.
- Use CSS custom properties for colors and theme values.
- Add a light/dark theme toggle.
- Avoid hard-coded theme colors in component styles where possible.

### 7. Accessibility and performance pass

- Use semantic markup.
- Keep filters keyboard-operable.
- Add visible focus states.
- Add meaningful image alt text.
- Lazy-load listing images.
- Keep the detail page hero image eager.
- Keep the payload small and avoid unnecessary libraries.

### 8. Documentation

- Add `README.md`.
- Add `AUDIT.md`.
- Add AI disclosure files in `/ai`.
- Document key decisions, trade-offs and future improvements.

## Trade-offs

- Artificial pagination is used because the dataset contains only 16 devices.
- No Pinia store is used because the URL is enough as the source of truth.
- No full UI kit is used because the assignment asks to show UI decisions.
- Runtime props are used temporarily in some components because the local dependency setup had issues resolving imported interfaces in `defineProps<T>()`.
- RO/RU localization is left as a possible future improvement instead of taking time from the core scope.
- The sorting dropdown uses a native `select` to keep accessibility and browser behavior simple.

## Final verification checklist

- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run build`
- Verify `/`
- Verify filtered URLs
- Verify pagination
- Verify `/devices/galaxy-s25`
- Verify an unknown device route
- Verify light and dark themes
- Verify keyboard navigation
- Verify responsive layout at 375 px, tablet and desktop widths
