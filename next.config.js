/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public'
})

module.exports = withPWA({
  disable: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["pg", "pg-native"],
    enableUndici: true
  },
})
