# 🚀 Deployment Guide

## Pre-Deployment Checklist

### Environment Variables
Ensure all required environment variables are set:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.intrades.com
NEXT_PUBLIC_BASE_URL=https://intrades.com

# AWS S3 (for file uploads)
NEXT_PUBLIC_S3_BUCKET=intrades-submissions
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net

# Google Maps (if used)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

### Build Optimization
- [ ] Run `npm run build` successfully
- [ ] Check bundle size: `npm run build` shows bundle analysis
- [ ] Verify all routes build without errors
- [ ] Test production build locally: `npm run start`

### Security
- [ ] Review security headers in `next.config.js`
- [ ] Verify HTTPS is enforced
- [ ] Check CORS settings
- [ ] Review API authentication tokens
- [ ] Audit dependencies: `npm audit`

### Testing
- [ ] All unit tests pass: `npm run test:run`
- [ ] Integration tests pass
- [ ] E2E tests pass: `npm run e2e`
- [ ] Manual testing on staging

## Deployment Options

### Vercel (Recommended for Next.js)

1. **Connect Repository**
   ```bash
   vercel login
   vercel link
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   - Set in Vercel dashboard: Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables

### Netlify

1. **Build Settings**
   - Build command: `cd web && npm run build`
   - Publish directory: `web/.next`

2. **Environment Variables**
   - Set in Netlify dashboard: Site settings → Environment variables

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY web/package*.json ./web/
RUN cd web && npm ci
COPY web/ ./web/
RUN cd web && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/web/.next ./.next
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### AWS Amplify

1. Connect repository
2. Build settings:
   - Build command: `cd web && npm run build`
   - Output directory: `web/.next`
3. Set environment variables in Amplify console

## Post-Deployment

### Verification
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] API calls succeed
- [ ] File uploads work
- [ ] PWA install prompt appears
- [ ] Service worker registers
- [ ] Offline page works

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### Performance
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check Core Web Vitals
- [ ] Verify bundle sizes
- [ ] Test on mobile devices

## Rollback Procedure

If issues occur:

1. **Vercel**: Use dashboard to revert to previous deployment
2. **Manual**: Revert git commit and redeploy
3. **Database**: Restore from backup if needed

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security advisories
- Monitor error logs
- Check performance metrics
- Update content as needed

