/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.thalia.media', 'covers.libro.fm', 'm.media-amazon.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;