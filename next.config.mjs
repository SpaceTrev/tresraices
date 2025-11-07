/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true, serverActions: { bodySizeLimit: '10mb' } }
};
export default nextConfig;
