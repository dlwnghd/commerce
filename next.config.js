const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ['picsum.photos', 'raw.githubusercontent.com', 'cdn.shopify.com'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
