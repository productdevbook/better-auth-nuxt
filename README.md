# Better Auth Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for simple, flexible authentication in your Nuxt 3 applications.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🔒 &nbsp;Simple authentication for Nuxt 3 applications
- 🚀 &nbsp;Built-in authentication middleware
- 🔑 &nbsp;Multiple authentication strategies (username, email)
- 🛡️ &nbsp;Role-based access control
- 🔄 &nbsp;Session management
- 📱 &nbsp;Redirect handling for authenticated/unauthenticated users

## Quick Setup

1. Install the module:

```bash
# Using npm
npm install better-auth-nuxt

# Using yarn
yarn add better-auth-nuxt

# Using pnpm
pnpm add better-auth-nuxt
```

2. Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['better-auth-nuxt'],

  betterAuth: {
    // Configure auth endpoints (default: '/api/auth/**')
    endpoint: '/api/auth/**',

    // Configure redirect paths
    redirectOptions: {
      redirectGuestTo: '/auth/login',
      redirectUserTo: '/',
      redirectUnauthorizedTo: '/401',
    },

    // Configure client and server options
    options: {
      client: {
        basePath: '/api/auth',
        // Optional: baseURL, disableDefaultFetchPlugins
      },
      server: {
        appName: 'My Nuxt App',
        // Optional: baseURL, basePath, secret
      },
    },
  }
})
```

3. Use the module in your pages:

```vue
<script setup>
// Protect route for authenticated users only
definePageMeta({
  auth: {
    only: 'user',
  }
})

// Access auth functionality
const { loggedIn, user, signOut } = useUserSession()
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome, {{ user?.name }}</h1>
    <button @click="signOut()">Sign Out</button>
  </div>
</template>
```

## Module Options

### Auth Configuration

```ts
interface ModuleOptions {
  // Auth endpoint
  endpoint: string

  // Patterns to match auth configuration files
  serverConfigs?: string[]
  clientConfigs?: string[]

  // Client and server options
  options: {
    client?: ModuleClientOptions
    server?: ModuleServerOptions
  }

  // Redirect options
  redirectOptions: {
    redirectUserTo?: string
    redirectGuestTo?: string
    redirectUnauthorizedTo?: string
  }
}
```

### Server Options

```ts
interface ModuleServerOptions {
  appName?: string   // Application name
  baseURL?: string   // Base URL for the auth API
  basePath?: string  // Base path for the auth API
  secret?: string    // Secret for JWT/session encryption
}
```

### Client Options

```ts
interface ModuleClientOptions {
  baseURL?: string                  // Base URL for the auth API
  basePath?: string                 // Base path for the auth API
  disableDefaultFetchPlugins?: boolean // Disable default fetch plugins
}
```

## API Reference

### Client-side Composables

#### `useUserSession()`

Provides access to the authenticated user session and auth methods.

```ts
const {
  // State
  loggedIn,         // Ref<boolean> - Is the user logged in
  user,             // Ref<User> - Current user data
  session,          // Ref<Session> - Current session data

  // Methods
  fetchSession,     // () => Promise<void> - Fetch current session
  signIn: {
    username,       // (credentials) => Promise<void> - Sign in with username
    email,          // (credentials) => Promise<void> - Sign in with email
  },
  signUp: {
    username,       // (userData) => Promise<void> - Register with username
    email,          // (userData) => Promise<void> - Register with email
  },
  signOut,          // (options?) => Promise<void> - Sign out the user

  // Configuration
  options,          // Auth configuration options
} = useUserSession()
```

### Server-side Utilities

#### `useAuth()`

Access the auth instance on the server.

```ts
// In API route handlers:
const auth = useAuth()
```

### Route Protection

Use the `auth` meta property to protect routes:

```ts
definePageMeta({
  auth: {
    // Only allow specific roles
    only: 'user' | 'admin' | 'guest' | ['user', 'admin'],

    // Custom redirect paths (override global config)
    redirectUserTo: '/dashboard',
    redirectGuestTo: '/login',
    redirectUnauthorizedTo: '/unauthorized',
  }
})
```

## Configuration Files

You can create configuration files to customize authentication:

### Server Configuration

Create a `*.better-auth.ts` file to configure server-side auth:

```ts
// app/my-auth.better-auth.ts
export default {
  // Custom server-side auth configuration
}
```

### Client Configuration

Create a `*.better-auth-client.ts` file to configure client-side auth:

```ts
// app/my-auth.better-auth-client.ts
export default {
  // Custom client-side auth configuration
}
```

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground
  npm run dev

  # Build the playground
  npm run dev:build

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/better-auth-nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/better-auth-nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/better-auth-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/better-auth-nuxt

[license-src]: https://img.shields.io/npm/l/better-auth-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/better-auth-nuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
