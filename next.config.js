/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://emojicon.kr/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;