/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
    env: {
        NEXTAUTH_SECRET: "your-secret-key-for-jwt-encryption",
        NEXTAUTH_URL: "http://localhost:3000"
    }
};

export default withNextIntl(nextConfig); 