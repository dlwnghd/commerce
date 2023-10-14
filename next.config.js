/**
 * FILENAME   : next.config.js
 * PURPOSE    : Next 설정 파일
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-13 / 구글 이미지 경로 추가 / Lee Juhong
 */

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
    domains: [
      'picsum.photos',
      'raw.githubusercontent.com',
      'cdn.shopify.com',
      'lh3.googleusercontent.com',
      'k.kakaocdn.net',
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
