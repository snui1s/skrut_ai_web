import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/results/latest/', // Don't index results page as it's user-specific
    },
    sitemap: 'https://skrut.vercel.app/sitemap.xml',
  };
}
