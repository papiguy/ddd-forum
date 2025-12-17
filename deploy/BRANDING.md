# Branding Configuration Guide

This document explains how to customize the branding (logo, name, tagline, and external links) for your DDD Forum deployment.

## Overview

All branding elements are configured through environment variables in the `public/app/.env` file. The application uses a centralized branding configuration module (`src/config/branding.ts`) that reads these environment variables.

## Environment Variables

Add the following variables to `public/app/.env`:

```bash
# Branding Configuration
REACT_APP_BRAND_NAME=Your Brand Name
REACT_APP_BRAND_TAGLINE=Your Tagline
REACT_APP_BRAND_LOGO=/your-logo.png
REACT_APP_BRAND_COPYRIGHT=Your Company Inc.

# External Links
REACT_APP_DISCORD_URL=https://discord.gg/your-invite
REACT_APP_STUDIO_URL=https://yourdomain.com/create
REACT_APP_HOME_URL=https://yourdomain.com
REACT_APP_TERMS_URL=https://yourdomain.com/terms-of-service
REACT_APP_PRIVACY_URL=https://yourdomain.com/privacy-policy
```

## Asset Files

### Logo Files

1. Place your logo file in `public/app/public/` directory
2. Update the `REACT_APP_BRAND_LOGO` environment variable to point to your logo
3. For deployment, also place a copy in `deploy/assets/` for version control

### Supported Formats

- PNG (recommended)
- SVG
- JPG

### Recommended Dimensions

- Header logo: 120x40px (or similar aspect ratio)
- Footer logo: 100x30px (or similar aspect ratio)

## What Gets Branded

The branding configuration affects:

### Header
- Logo image
- Brand name text
- Site title (browser tab)

### Footer
- Logo image
- Copyright text
- External links (Discord, Studio, Legal pages)

### Page Title
- Browser tab title format: `{BRAND_NAME} | {TAGLINE}`

## Default Values

If environment variables are not set, the following defaults are used:

```typescript
{
  name: 'DDD Forum',
  tagline: 'Domain-Driven Designers Community',
  logo: '/logo.png',
  copyright: 'DDD Community',
}
```

External links default to local routes or placeholder URLs.

## Example Configurations

### Example 1: Tech Community

```bash
REACT_APP_BRAND_NAME=DevHub
REACT_APP_BRAND_TAGLINE=Where developers connect
REACT_APP_BRAND_LOGO=/devhub-logo.png
REACT_APP_BRAND_COPYRIGHT=DevHub Community
```

### Example 2: Game Studio

```bash
REACT_APP_BRAND_NAME=GameForge
REACT_APP_BRAND_TAGLINE=Create, Play, Share
REACT_APP_BRAND_LOGO=/gameforge-logo.png
REACT_APP_BRAND_COPYRIGHT=GameForge Studios Inc.
```

## Development vs Production

You can use different branding for development and production environments:

### Development (.env.development)
```bash
REACT_APP_BRAND_NAME=DDD Forum [DEV]
REACT_APP_HOME_URL=http://localhost:3000
```

### Production (.env.production)
```bash
REACT_APP_BRAND_NAME=DDD Forum
REACT_APP_HOME_URL=https://forum.yourdomain.com
```

## Troubleshooting

### Logo not showing

1. Ensure the logo file is in `public/app/public/` directory
2. The path in `REACT_APP_BRAND_LOGO` should start with `/`
3. Restart the development server after changing environment variables

### Changes not reflecting

1. Stop the development server
2. Clear the browser cache
3. Restart the development server with `npm start`

### Environment variables not working

1. Environment variable names must start with `REACT_APP_`
2. After adding new variables, restart the server
3. Check that the `.env` file is in `public/app/` directory

## File Locations

- **Environment config**: `public/app/.env`
- **Branding module**: `public/app/src/config/branding.ts`
- **Logo assets (dev)**: `public/app/public/`
- **Logo assets (deploy)**: `deploy/assets/`
- **Header component**: `public/app/src/shared/components/header/components/NewHeader.tsx`
- **Footer component**: `public/app/src/shared/components/footer/components/Footer.tsx`

## Advanced Customization

To add additional branding elements:

1. Add new environment variable in `.env`
2. Update `public/app/src/config/branding.ts` to read the variable
3. Use the config value in your components

Example:

```typescript
// In branding.ts
export const branding = {
  // ... existing config
  slogan: process.env.REACT_APP_SLOGAN || 'Default slogan',
};

// In your component
import { branding } from '../config/branding';

<h2>{branding.slogan}</h2>
```
