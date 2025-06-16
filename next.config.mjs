/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://192.168.0.76:3000',
    'https://1690-2600-8800-7088-9a00-5068-12d0-83a4-ee7.ngrok-free.app', // ✅ Add your Ngrok URL here
  ],
}

export default nextConfig
