/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  // username.github.io는 루트에서 서비스되므로 basePath/assetPrefix 불필요
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;