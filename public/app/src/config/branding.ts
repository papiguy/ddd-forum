/**
 * Branding configuration
 * All branding-related constants are centralized here and derived from environment variables
 */

export const branding = {
  name: process.env.REACT_APP_BRAND_NAME || 'DDD Forum',
  tagline: process.env.REACT_APP_BRAND_TAGLINE || 'Domain-Driven Designers Community',
  logo: process.env.REACT_APP_BRAND_LOGO || '/logo.png',
  copyright: process.env.REACT_APP_BRAND_COPYRIGHT || 'DDD Community',
};

export const externalLinks = {
  discord: process.env.REACT_APP_DISCORD_URL || 'https://discord.com',
  studio: process.env.REACT_APP_STUDIO_URL || '/submit',
  home: process.env.REACT_APP_HOME_URL || '/',
  terms: process.env.REACT_APP_TERMS_URL || '/terms-of-service',
  privacy: process.env.REACT_APP_PRIVACY_URL || '/privacy-policy',
};
