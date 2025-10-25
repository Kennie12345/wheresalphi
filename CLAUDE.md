# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js starter application integrated with Supabase for authentication and database functionality. It uses the App Router, server-side rendering, and cookie-based authentication via `@supabase/ssr`.

## Common Commands

```bash
# Development (uses Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Environment Setup

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable/anon key

The app checks for these vars via `hasEnvVars` in [lib/utils.ts](lib/utils.ts) and skips middleware auth checks if not configured.

## Architecture

### Authentication Flow

The app uses cookie-based authentication with three Supabase client implementations:

1. **Server Components** ([lib/supabase/server.ts](lib/supabase/server.ts))
   - Uses `createServerClient` with `next/headers` cookies
   - Must be called per-request, never stored globally (important for Vercel Fluid Compute)

2. **Client Components** ([lib/supabase/client.ts](lib/supabase/client.ts))
   - Uses `createBrowserClient` for browser-side operations

3. **Middleware** ([lib/supabase/middleware.ts](lib/supabase/middleware.ts))
   - Refreshes user sessions on each request
   - Protected route logic: redirects unauthenticated users to `/auth/login`
   - **Critical**: Must call `supabase.auth.getClaims()` to prevent random logouts with SSR
   - **Critical**: Must return the original `supabaseResponse` object with cookies intact

### Route Structure

- `/` - Public landing page
- `/auth/*` - Authentication pages (login, sign-up, forgot-password, etc.)
- `/protected/*` - Authenticated-only pages (checks user claims, redirects if not logged in)

The middleware ([middleware.ts](middleware.ts)) handles session refresh and protects routes by checking user claims. Non-authenticated users are redirected to `/auth/login` unless on `/`, `/auth/*`, or `/login` routes.

### Protected Pages Pattern

Protected pages follow this pattern (see [app/protected/page.tsx](app/protected/page.tsx)):
1. Create server Supabase client
2. Check user claims with `supabase.auth.getClaims()`
3. Redirect to login if no claims or error
4. Render protected content

### Component Organization

- `components/` - Feature components (auth forms, tutorial steps, logos)
- `components/ui/` - shadcn/ui components (button, input, card, etc.)
- `app/` - Next.js App Router pages and layouts
- `lib/` - Utility functions and Supabase client configurations

### Styling

- Tailwind CSS with custom config ([tailwind.config.ts](tailwind.config.ts))
- shadcn/ui components (configured in [components.json](components.json))
- Dark mode support via `next-themes` (provider in [app/layout.tsx](app/layout.tsx))
- Utility function `cn()` in [lib/utils.ts](lib/utils.ts) for conditional class merging

## Key Patterns

### Supabase Client Creation
- Always create a new server client per request/function - never store in global variables
- Server components: `await createClient()` from `@/lib/supabase/server`
- Client components: `createClient()` from `@/lib/supabase/client`

### Middleware Best Practices
- Do not run code between `createServerClient` and `supabase.auth.getClaims()`
- Must call `getClaims()` to prevent random logout issues with SSR
- When creating custom responses, copy cookies from `supabaseResponse`

### Authentication State
- Check user authentication via `supabase.auth.getClaims()`
- Claims contain user data accessible via `data?.claims`
- Redirect pattern: `redirect("/auth/login")` for unauthorized access
