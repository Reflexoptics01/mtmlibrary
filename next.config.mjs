/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Disable static generation for routes that use client-side functionality like useSearchParams
  experimental: {
    // Exclude routes from static generation
    excludeExports: ['borrowings/add']
  }
};

export default nextConfig; 