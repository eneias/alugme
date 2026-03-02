# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React)
```bash
npm run dev        # Start dev server at http://localhost:2400/alugme
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Backend (.NET 8)
```bash
# With Docker (recommended)
cd backend && docker compose up --build
# API available at http://localhost:8080/swagger

# Without Docker
cd backend/Alugme.Api
dotnet ef database update
dotnet run

# Tests
cd backend/Alugme.Tests
dotnet test
```

## Architecture

This is a Brazilian property rental platform ("AlugMe") with a React frontend and a .NET 8 backend.

### Frontend: React + Vite + TypeScript
- **Path alias**: `@/` maps to `src/`
- **Routing**: React Router v6 with `basename="/alugme"`. Routes are defined in [src/App.tsx](src/App.tsx)
- **Auth**: Custom JWT-based auth. Login calls `POST http://localhost:5000/api/auth/login`. Token and user object stored in `localStorage` as `token` and `user`. The `getAuthHeaders()` helper in [src/pages/Login.tsx](src/pages/Login.tsx) produces the `Authorization: Bearer` header for API calls.
- **Role-based access**: Three roles — `admin`, `locador` (landlord), `locatario` (tenant). `ProtectedRoute` in [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx) reads the user object from `localStorage` and gates routes by role.
- **UI**: shadcn/ui components (Radix UI primitives + Tailwind CSS). Component library configured via [components.json](components.json).
- **Data fetching**: TanStack Query v5. Supabase client is configured in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) (env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- **Mock data**: `src/data/` contains TypeScript files with static mock data (`properties.ts`, `landlords.ts`, `users.ts`, `inspections.ts`, `banners.ts`). These are used by the frontend when not yet connected to the backend API.

### Frontend Route Structure
- `/` — Property listing/search (Index)
- `/property/:id` — Property detail
- `/rent/:id` — Rental contract flow
- `/inspection/:contractId` — Inspection form
- `/login`, `/register` — Auth pages
- `/profile`, `/profile/edit` — Authenticated user profile
- `/landlord/*` — Landlord portal (requires `locador` role): properties, rental history, contracts, inspections, bank account setup
- `/admin/*` — Admin portal (requires `admin` role): dashboard, banners, properties, users

### Backend: .NET 8 API
- **Location**: `backend/Alugme.Api/`
- **Database**: SQL Server via Entity Framework Core. Connection string in `appsettings.json`.
- **Auth**: JWT Bearer authentication (configured in [backend/Alugme.Api/Program.cs](backend/Alugme.Api/Program.cs))
- **CORS**: Configured for `http://localhost:2400` (the frontend dev server)
- **Domain entities** ([backend/Alugme.Api/Domain/Entities.cs](backend/Alugme.Api/Domain/Entities.cs)): `User`, `Property`, `Landlord`, `BankAccount`, `Rental`, `RentalContract`, `Inspection`, `InspectionPhoto`, `Banner`
- **Roles**: `AppRole` enum with `Admin`, `Locador`, `Locatario` (see [backend/Alugme.Api/Domain/Enums.cs](backend/Alugme.Api/Domain/Enums.cs))
- **Swagger**: Available at `/swagger` in development. Supports Bearer token auth.
- **Seed data**: On first run, seeds `admin@admin.com` / `123456`, a `locatario` (maria@admin.com), and a `locador` (carlos@admin.com), all with password `123456`.

### Key Data Relationships
- A `Landlord` entity aggregates `User`s, `Property`s, `BankAccount`s, `Rental`s, and `RentalContract`s
- A `User` can be linked to a `Landlord` via `LandlordId`
- `Inspection`s belong to a `Property` and contain `InspectionPhoto`s uploaded by either landlord or tenant (`UploadedByType`)
- Contract status: `Active`, `Completed`, `Cancelled`
- Property availability: `available`, `rented`, `maintenance`

### Environment Variables
Frontend requires a `.env` file:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```
