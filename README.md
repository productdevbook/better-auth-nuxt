# better-auth-nuxt

> [!IMPORTANT]
> **This module has moved to [nuxt-modules/better-auth](https://github.com/nuxt-modules/better-auth).**
> This repository is archived and no longer maintained, and the `better-auth-nuxt`
> package on npm receives no further updates.

Better Auth for Nuxt is now maintained under the Nuxt Modules organisation:

- **Repository:** https://github.com/nuxt-modules/better-auth
- **Documentation:** https://better-auth.nuxt.dev
- **Package:** `@onmax/nuxt-better-auth`

## Moving over

```bash
npm uninstall better-auth-nuxt
npx nuxi module add @onmax/nuxt-better-auth
```

Then follow the [installation guide](https://better-auth.nuxt.dev/getting-started/installation).
It is not a drop-in replacement — the new module has its own config files
(`server/auth.config.ts`, `app/auth.config.ts`) and its own composables, so read
the guide rather than swapping the dependency and hoping.

The old module's source and documentation remain in this repository's history.

## License

[MIT](./LICENSE)
