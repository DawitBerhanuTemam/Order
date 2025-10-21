/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: output: 'export' is commented out because it's incompatible with API routes
  // Uncomment only after migrating all API routes to Firebase Functions
  // output: 'export',
  images: {
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
  }
}

module.exports = nextConfig
