/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  transpilePackages: ["lodash-es", "lodash-es"],
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["robohash.org"],
  },
};

module.exports = nextConfig;
