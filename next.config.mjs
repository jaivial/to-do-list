/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_SECRET: "your-secret-key-for-jwt-encryption",
        NEXTAUTH_URL: "http://localhost:3000"
    }
};

export default nextConfig; 