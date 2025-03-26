/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify sudah default di Next.js 15, jadi nggak perlu
  experimental: {
    appDir: true, // Sesuai dengan struktur Next.js terbaru
  },
};

export default nextConfig;
