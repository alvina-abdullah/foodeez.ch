# Project Structure Overhaul

## Root Structure
```
foodeez/
├── src/                  # Source code
│   ├── app/              # Next.js app router pages
│   ├── shared/           # Shared components, hooks, utils, etc.
│   ├── features/         # Feature-based modules
│   ├── services/         # API and external service integrations
│   ├── config/           # App configuration
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles
│   └── lib/              # Library code and utility functions
├── public/               # Static assets
├── prisma/               # Database schema and migrations
└── [Config files]        # Various configuration files
```

## Shared Module Structure
```
shared/
├── components/           # Reusable UI components
│   ├── ui/               # Core UI components (buttons, inputs, etc.)
│   ├── layout/           # Layout components (headers, footers, etc.)
│   └── common/           # Common components used across features
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── constants/            # Shared constants and configuration values
```

## Feature Module Structure
Each feature module follows a consistent structure:
```
features/[feature-name]/
├── components/           # Feature-specific components
├── hooks/                # Feature-specific hooks
├── services/             # Feature-specific services
├── utils/                # Feature-specific utilities
└── types/                # Feature-specific type definitions
```

## Services Structure
```
services/
├── api/                  # API service clients
├── auth/                 # Authentication services
└── [other-services]/     # Other external services
```

## Styles Structure
```
styles/
├── globals.css           # Global styles
├── variables.css         # CSS variables
└── themes/               # Theme-related styles
```

## App Directory Structure
Follows Next.js App Router conventions with a clean organization:
```
app/
├── layout.tsx            # Root layout
├── page.tsx              # Home page
├── [feature]/            # Feature-specific routes
│   └── page.tsx
└── api/                  # API routes
    └── [endpoint]/
        └── route.ts
```

## Implementation Plan

1. Move all core UI components to `src/shared/components/ui`
2. Reorganize feature-specific components into their respective feature modules
3. Structure app directory to follow Next.js App Router conventions
4. Centralize service integrations in the services directory
5. Consolidate utility functions in appropriate locations
6. Create proper type definitions for improved type safety 