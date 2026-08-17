/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'themehrofficial.local',
      },
    ],
  },
};

export default nextConfig;