# Frontend Overview

The admin UI lives in `apps/web` and is built with React + TypeScript, Vite, Tailwind CSS, and TanStack Query.

## Layout & Routing
- `main.tsx` wires up `QueryClientProvider`, `AuthProvider`, and `BrowserRouter`.
- `App.tsx` defines routes:
  - `/login` – anonymous entry point
  - `/people`, `/giving`, `/reports` – authenticated sections guarded by `ProtectedRoute`
- `components/layout/AppLayout.tsx` renders the shared header, navigation, and container shell.

## Auth Flow
- `hooks/useAuth.tsx` provides a simple context with `login` and `logout` helpers.
- Tokens persist in `localStorage`; protected routes redirect guests to `/login`.

## Feature Areas
- People (`pages/PeoplePage.tsx`)
  - Search + tag filters (`/api/people/persons`)
  - Reusable `PersonForm` component for create/update
  - Inline delete with confirmation
- Giving (`pages/GivingPage.tsx`)
  - Fund management with `FundForm`
  - Donation list with filters, summaries, and `DonationForm`
  - Shared `InlineAlert` for messaging
- Reports (`pages/ReportsPage.tsx`) consumes `/api/reports/giving/summary`.

## Styling
- Tailwind-based utility classes live in `src/index.css` (`card`, `btn`, `container-px`, etc.).
- Dark mode leverages Tailwind’s `dark` variant; base colors defined in `tailwind.config.ts`.
- Tables share a `.table` utility class.

## Next Steps
- Introduce route-level loaders for pre-fetching data.
- Add dedicated smart-list and attendance screens.
- Layer in toast notifications and form validation states.
