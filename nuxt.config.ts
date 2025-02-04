// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/ico', href: '/favicon.ico' }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@hebilicious/vue-query-nuxt',
  ],

  imports: {
    dirs: ['types/**'],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL,
      APPWRITE_ENDPOINT: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
      PROJECT_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECT,
      BUCKET: process.env.NUXT_PUBLIC_APPWRITE_BUCKET,
    },
    APPWRITE_ENDPOINT: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
    PROJECT_ID: process.env.NUXT_PUBLIC_APPWRITE_PROJECT,
    USERS_COLLECTION_ID: process.env.NUXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    BUCKET: process.env.NUXT_PUBLIC_APPWRITE_BUCKET,
    DATABASE_ID: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID,
    FILES_COLLECTION: process.env.NUXT_PUBLIC_APPWRITE_FILES_COLLECTION
  },

  compatibilityDate: '2025-01-24',
})