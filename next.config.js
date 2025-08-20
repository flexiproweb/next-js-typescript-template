/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.intellinum.com',
        port: '',
        pathname: '/wp-content/uploads/**',
        search: '',
      },
    ],
  },
}

module.exports = nextConfig
