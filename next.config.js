/** @type {import('next').NextConfig} */
const nextConfig = {
   typescript: {
    ignoreBuildErrors: true,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
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
