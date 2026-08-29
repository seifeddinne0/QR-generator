/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Ignore ESLint errors during the production build on the host (Vercel).
		// This prevents serialization warnings from stopping the build while
		// keeping linting available during development.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
