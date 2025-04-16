import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-04-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  betterAuth: {
    redirectOptions: {
      redirectGuestTo: '/auth/login',
      redirectUserTo: '/',
    },
  },
})
