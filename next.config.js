/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for Firebase Hosting
  images: {
    unoptimized: true, // Firebase Hosting doesn't support Next.js Image Optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dawid-food-ordering.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com', // For Firebase Storage
      },
    ]
  },
  // Disable API routes for static export
  // You'll need to use Firebase Functions or client-side Firebase SDK instead
}

module.exports = nextConfig
