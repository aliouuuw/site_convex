# Deployment Guide - Les Hirondelles Website

## Table of Contents

- [Environment Overview](#environment-overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build Configuration](#build-configuration)
- [Deployment Process](#deployment-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Domain & SSL Configuration](#domain--ssl-configuration)
- [Monitoring & Analytics](#monitoring--analytics)
- [Backup & Recovery](#backup--recovery)
- [Performance Optimization](#performance-optimization)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)
- [Maintenance Procedures](#maintenance-procedures)

## Environment Overview

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   localhost     │    │   staging.      │    │ leshirondelles. │
│                 │    │ leshirondelles. │    │        sn       │
│                 │    │        sn       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Convex Dev     │    │ Convex Staging  │    │ Convex Prod     │
│  Environment    │    │  Environment    │    │  Environment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Specifications

#### Development
- **Purpose**: Local development and testing
- **URL**: http://localhost:5173
- **Database**: Convex development deployment
- **CDN**: Local assets
- **Analytics**: Disabled
- **Error Tracking**: Console only

#### Staging
- **Purpose**: Pre-production testing and content review
- **URL**: https://staging.leshirondelles.sn
- **Database**: Convex staging deployment
- **CDN**: Vercel/Netlify CDN
- **Analytics**: Limited tracking
- **Error Tracking**: Full error reporting

#### Production
- **Purpose**: Live website serving end users
- **URL**: https://leshirondelles.sn
- **Database**: Convex production deployment
- **CDN**: Global CDN with edge caching
- **Analytics**: Full Google Analytics + custom metrics
- **Error Tracking**: Real-time monitoring

## Prerequisites

### Required Tools & Accounts

#### Development Tools
```bash
# Node.js (Latest LTS)
node --version  # v18.x.x or higher
npm --version   # v9.x.x or higher

# Git
git --version  # v2.x.x or higher

# Code Editor
# VS Code with recommended extensions:
# - ES7+ React/Redux/React-Native snippets
# - TypeScript Importer
# - Prettier - Code formatter
# - ESLint
```

#### Required Accounts
1. **GitHub Account** - Source code repository
2. **Convex Account** - Backend and database
3. **Vercel/Netlify Account** - Frontend hosting
4. **Domain Registrar** - Domain management
5. **Google Analytics** - Website analytics
6. **Sentry** (Optional) - Error tracking

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/leshirondelles-website.git
cd leshirondelles-website
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

#### 4. Convex Setup
```bash
# Install Convex CLI
npm install -g convex

# Login to Convex
npx convex login

# Initialize Convex project
npx convex dev
```

#### 5. Start Development Server
```bash
npm run dev
```

## Environment Setup

### Development Environment

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "convex:dev": "npx convex dev",
    "convex:deploy": "npx convex deploy",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@types': resolve(__dirname, './src/types'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          convex: ['convex']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
});
```

### Staging Environment

#### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "vite",
  "git": {
    "deploymentEnabled": {
      "main": false,
      "staging": true
    }
  },
  "env": {
    "VITE_CONVEX_URL": "@convex-staging-url",
    "VITE_ENVIRONMENT": "staging",
    "VITE_SITE_URL": "https://staging.leshirondelles.sn"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Production Environment

#### Production Build Optimization
```typescript
// vite.config.prod.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for security
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          convex: ['convex']
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## Build Configuration

### Build Process Overview

#### 1. Pre-build Checks
```bash
#!/bin/bash
# scripts/pre-build.sh

echo "🔍 Running pre-build checks..."

# Type checking
echo "📝 Checking TypeScript..."
npm run type-check

# Linting
echo "🔍 Running ESLint..."
npm run lint

# Testing
echo "🧪 Running tests..."
npm run test

echo "✅ Pre-build checks passed!"
```

#### 2. Build Script
```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "🏗️  Starting build process..."

# Clean previous build
rm -rf dist

# Build Convex functions
echo "📦 Building Convex functions..."
npx convex deploy --prod

# Build frontend
echo "🎨 Building frontend..."
npm run build

# Post-build optimizations
echo "⚡ Optimizing build..."
./scripts/optimize-build.sh

echo "✅ Build completed successfully!"
```

#### 3. Build Optimization
```bash
#!/bin/bash
# scripts/optimize-build.sh

echo "🚀 Optimizing build assets..."

# Compress images (if not already optimized)
if command -v imagemin &> /dev/null; then
    imagemin dist/assets/images/* --out-dir=dist/assets/images/ --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant
fi

# Generate service worker for caching
if [ -f "sw-precache-config.js" ]; then
    sw-precache --config=sw-precache-config.js
fi

echo "✅ Build optimization completed!"
```

### Environment-Specific Builds

#### Development Build
```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production"
  }
}
```

#### Build Configurations
```typescript
// src/config/build.ts
export const getBuildConfig = () => {
  const mode = import.meta.env.MODE;
  
  return {
    isDevelopment: mode === 'development',
    isStaging: mode === 'staging',
    isProduction: mode === 'production',
    enableDebugger: mode !== 'production',
    enableAnalytics: mode === 'production',
    enableErrorReporting: mode !== 'development'
  };
};
```

## Deployment Process

### Automated Deployment (Recommended)

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy Convex (Staging)
        run: npx convex deploy --prod-url ${{ secrets.CONVEX_STAGING_URL }}
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_STAGING_DEPLOY_KEY }}
      
      - name: Build application
        run: npm run build:staging
        env:
          VITE_CONVEX_URL: ${{ secrets.CONVEX_STAGING_URL }}
          VITE_ENVIRONMENT: staging
      
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy Convex (Production)
        run: npx convex deploy --prod
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_PROD_DEPLOY_KEY }}
      
      - name: Build application
        run: npm run build:prod
        env:
          VITE_CONVEX_URL: ${{ secrets.CONVEX_PROD_URL }}
          VITE_ENVIRONMENT: production
          VITE_GOOGLE_ANALYTICS_ID: ${{ secrets.GOOGLE_ANALYTICS_ID }}
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Notify deployment
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
          -H 'Content-type: application/json' \
          --data '{"text":"🚀 Les Hirondelles website deployed to production!"}'
```

### Manual Deployment

#### Production Deployment Checklist
```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] TypeScript compilation successful
- [ ] ESLint checks passed

### Content Review
- [ ] All content reviewed and approved
- [ ] Images optimized and compressed
- [ ] Meta tags and SEO content updated
- [ ] French language content verified

### Environment Setup
- [ ] Environment variables configured
- [ ] Convex production deployment ready
- [ ] SSL certificates valid
- [ ] DNS configuration correct

### Performance
- [ ] Bundle size analysis completed
- [ ] Performance metrics acceptable
- [ ] Lighthouse scores > 90
- [ ] Core Web Vitals passing

### Security
- [ ] Security headers configured
- [ ] No sensitive data exposed
- [ ] HTTPS enforced
- [ ] Content Security Policy set
```

#### Manual Deployment Steps
```bash
# 1. Prepare for deployment
git checkout main
git pull origin main
npm ci

# 2. Run pre-deployment checks
npm run type-check
npm run lint
npm run test

# 3. Deploy Convex backend
npx convex deploy --prod

# 4. Build frontend
npm run build:prod

# 5. Deploy to hosting platform
npm run deploy:prod

# 6. Verify deployment
curl -I https://leshirondelles.sn
npm run test:e2e:prod
```

## CI/CD Pipeline

### Pipeline Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│   Build & Test  │───▶│   Deploy        │
│   (Git)         │    │   (GitHub       │    │   (Vercel)      │
│                 │    │    Actions)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Trigger       │    │   Quality       │    │   Health        │
│   Webhook       │    │   Checks        │    │   Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Branch Strategy

#### Git Flow
```
main (production)
├── staging (pre-production)
├── develop (integration)
└── feature/* (feature branches)
    ├── feature/homepage-redesign
    ├── feature/journal-improvements
    └── feature/contact-form-update
```

#### Branch Protection Rules
```yaml
# GitHub branch protection settings
main:
  required_status_checks:
    - test
    - lint
    - type-check
  enforce_admins: true
  required_pull_request_reviews:
    required_approving_review_count: 2
    dismiss_stale_reviews: true
  restrictions:
    users: ["admin-user"]
    teams: ["core-team"]

staging:
  required_status_checks:
    - test
    - lint
  required_pull_request_reviews:
    required_approving_review_count: 1
```

### Deployment Strategies

#### Blue-Green Deployment
```yaml
# Deploy new version alongside old version
name: Blue-Green Deployment

steps:
  - name: Deploy Green (New Version)
    run: |
      # Deploy to staging slot
      vercel --prod --scope staging
  
  - name: Health Check
    run: |
      # Verify new deployment
      curl -f https://staging.leshirondelles.sn/health
  
  - name: Switch Traffic
    run: |
      # Switch production traffic to new version
      vercel alias staging.leshirondelles.sn leshirondelles.sn
  
  - name: Cleanup
    run: |
      # Remove old version after successful switch
      vercel rm old-deployment-url
```

#### Rolling Deployment
```yaml
# Gradual traffic shift
name: Rolling Deployment

steps:
  - name: Deploy New Version
    run: vercel --prod
  
  - name: Gradual Traffic Shift
    run: |
      # 10% traffic to new version
      vercel alias --percent 10 new-version.vercel.app leshirondelles.sn
      sleep 300
      
      # 50% traffic
      vercel alias --percent 50 new-version.vercel.app leshirondelles.sn
      sleep 300
      
      # 100% traffic
      vercel alias new-version.vercel.app leshirondelles.sn
```

## Environment Variables

### Variable Categories

#### Public Variables (VITE_*)
```bash
# Client-side accessible variables
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
VITE_ENVIRONMENT=production
VITE_SITE_URL=https://leshirondelles.sn
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_CONTACT_EMAIL=contact@leshirondelles.sn
VITE_PHONE_NUMBER=+221XXXXXXXXX
```

#### Private Variables
```bash
# Server-side only variables
CONVEX_DEPLOY_KEY=your-convex-deploy-key
VERCEL_TOKEN=your-vercel-token
GITHUB_TOKEN=your-github-token
SLACK_WEBHOOK_URL=your-slack-webhook
SENTRY_DSN=your-sentry-dsn
OPENAI_API_KEY=your-openai-key (if using AI features)
```

### Environment Configuration

#### .env.example
```bash
# Copy this file to .env.local and fill in your values

# Convex Configuration
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Application Settings
VITE_ENVIRONMENT=development
VITE_SITE_URL=http://localhost:5173

# Contact Information
VITE_CONTACT_EMAIL=contact@leshirondelles.sn
VITE_PHONE_NUMBER=+221XXXXXXXXX
VITE_ADDRESS="Dakar, Sénégal"

# Analytics (Production only)
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_TAG_MANAGER_ID=

# Social Media
VITE_FACEBOOK_URL=https://facebook.com/leshirondelles
VITE_INSTAGRAM_URL=https://instagram.com/leshirondelles
VITE_LINKEDIN_URL=https://linkedin.com/company/leshirondelles

# Development Tools
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MOCK_DATA=false
```

#### Environment Validation
```typescript
// src/utils/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_CONVEX_URL: z.string().url(),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  VITE_SITE_URL: z.string().url(),
  VITE_CONTACT_EMAIL: z.string().email(),
  VITE_GOOGLE_ANALYTICS_ID: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);

export const isDevelopment = env.VITE_ENVIRONMENT === 'development';
export const isStaging = env.VITE_ENVIRONMENT === 'staging';
export const isProduction = env.VITE_ENVIRONMENT === 'production';
```

## Domain & SSL Configuration

### DNS Configuration

#### Domain Setup
```
# DNS Records for leshirondelles.sn

# Main domain
A    leshirondelles.sn    76.76.19.123
AAAA leshirondelles.sn    2600:1f14:dead:beef::1

# WWW redirect
CNAME www.leshirondelles.sn    leshirondelles.sn

# Staging subdomain
CNAME staging.leshirondelles.sn    staging-leshirondelles.vercel.app

# Email (if using custom email)
MX   leshirondelles.sn    10 mail.leshirondelles.sn

# Verification records
TXT  leshirondelles.sn    "v=spf1 include:_spf.google.com ~all"
TXT  _dmarc.leshirondelles.sn    "v=DMARC1; p=reject; rua=mailto:dmarc@leshirondelles.sn"
```

#### SSL Certificate Setup
```bash
# Using Certbot for Let's Encrypt (if self-hosting)
sudo certbot certonly --webroot \
  -w /var/www/leshirondelles \
  -d leshirondelles.sn \
  -d www.leshirondelles.sn

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### CDN Configuration

#### Vercel Edge Functions
```typescript
// vercel/edge-config.ts
export const config = {
  runtime: 'edge',
  regions: ['fra1', 'dub1', 'iad1'], // Europe, Middle East, US
};

export default function handler(request: Request) {
  const url = new URL(request.url);
  
  // Security headers
  const headers = new Headers();
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Cache control for static assets
  if (url.pathname.startsWith('/assets/')) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return new Response(null, { headers });
}
```

## Monitoring & Analytics

### Health Monitoring

#### Health Check Endpoint
```typescript
// src/api/health.ts
export const healthCheck = async (): Promise<HealthStatus> => {
  const checks = await Promise.allSettled([
    checkConvexConnection(),
    checkCDNStatus(),
    checkCriticalPages(),
  ]);

  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      convex: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      cdn: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      pages: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    },
    version: process.env.VITE_APP_VERSION || 'unknown',
  };

  status.status = Object.values(status.checks).every(check => check === 'healthy') 
    ? 'healthy' 
    : 'unhealthy';

  return status;
};
```

#### Uptime Monitoring
```yaml
# .github/workflows/uptime-check.yml
name: Uptime Check

on:
  schedule:
    - cron: '*/5 * * * *' # Every 5 minutes

jobs:
  uptime-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check website status
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://leshirondelles.sn)
          if [ $response -ne 200 ]; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-type: application/json' \
            --data '{"text":"🚨 Website down! HTTP status: '$response'"}'
            exit 1
          fi
```

### Analytics Setup

#### Google Analytics 4
```typescript
// src/utils/analytics.ts
import { env } from './env';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const initializeAnalytics = () => {
  if (!env.VITE_GOOGLE_ANALYTICS_ID || !isProduction) return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${env.VITE_GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function() {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', env.VITE_GOOGLE_ANALYTICS_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!window.gtag || !isProduction) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackPageView = (path: string, title: string) => {
  if (!window.gtag || !isProduction) return;
  
  window.gtag('config', env.VITE_GOOGLE_ANALYTICS_ID, {
    page_path: path,
    page_title: title,
  });
};
```

#### Performance Monitoring
```typescript
// src/utils/performance.ts
export const trackWebVitals = () => {
  if (!isProduction) return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
};

const sendToAnalytics = (metric: any) => {
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};
```

## Backup & Recovery

### Database Backup Strategy

#### Automated Convex Backups
```typescript
// convex/backup.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily backup at 2 AM UTC
crons.daily(
  "backup database",
  { hourUTC: 2, minuteUTC: 0 },
  internal.backup.createDailyBackup
);

// Weekly backup on Sundays at 1 AM UTC
crons.weekly(
  "weekly backup",
  { dayOfWeek: "sunday", hourUTC: 1, minuteUTC: 0 },
  internal.backup.createWeeklyBackup
);
```

#### Backup Functions
```typescript
// convex/backup.ts
export const createDailyBackup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const timestamp = Date.now();
    
    // Export all tables
    const backup = {
      timestamp,
      pages: await ctx.db.query("pages").collect(),
      blogPosts: await ctx.db.query("blogPosts").collect(),
      programs: await ctx.db.query("programs").collect(),
      teamMembers: await ctx.db.query("teamMembers").collect(),
      settings: await ctx.db.query("siteSettings").collect(),
      users: await ctx.db.query("users").collect(),
    };

    // Store backup (implement your preferred storage solution)
    await storeBackupToExternalService(backup);
    
    console.log(`Daily backup created: ${new Date(timestamp).toISOString()}`);
  },
});

const storeBackupToExternalService = async (backup: any) => {
  // Implement backup storage to:
  // - AWS S3
  // - Google Cloud Storage
  // - Azure Blob Storage
  // - Or other backup service
};
```

### Disaster Recovery Plan

#### Recovery Procedures
```markdown
## Disaster Recovery Checklist

### Level 1: Minor Issues (