/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.gr-assets.com', 'placehold.co, placehold.jp' ], // Add the domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/600x400/**',
      },
    ],
  },
};

export default nextConfig;
