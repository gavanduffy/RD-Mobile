# Deployment Guide

This guide will help you deploy RD-Mobile to various platforms.

## Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

### Method 1: Deploy Button

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gavanduffy/RD-Mobile)

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from your local repository:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Method 3: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure settings
6. Click "Deploy"

## Environment Variables

No environment variables are required for basic operation. The app stores the Real-Debrid API key in the browser's localStorage.

Optional environment variables:
```bash
NEXT_PUBLIC_RD_API_URL=https://api.real-debrid.com/rest/1.0
```

## Custom Domain

After deployment on Vercel:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

## Other Platforms

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Install Next.js plugin for Netlify

### Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t rd-mobile .
docker run -p 3000:3000 rd-mobile
```

### Self-Hosted

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. The app will be available at `http://localhost:3000`

4. Use a reverse proxy (nginx/Apache) to serve on port 80/443

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## PWA Considerations

### HTTPS Required

Progressive Web Apps require HTTPS to function properly. Make sure your deployment platform provides SSL certificates (Vercel does this automatically).

### Service Worker

The service worker is automatically served from `/sw.js`. No additional configuration needed.

### Icons

Replace the placeholder icons in `/public/icons/` with your own app icons before deployment.

## Performance Optimization

The app is already optimized for production, but you can further improve performance:

1. **Enable CDN**: Vercel automatically provides edge caching
2. **Image Optimization**: Use Next.js Image component for user avatars
3. **Code Splitting**: Already handled by Next.js automatic code splitting
4. **Caching**: Service worker handles offline caching

## Monitoring

Consider adding analytics and monitoring:

- **Vercel Analytics**: Enable in project settings
- **Google Analytics**: Add to `app/layout.tsx`
- **Sentry**: For error tracking

## Updates

To update your deployment:

1. Push changes to your repository
2. Vercel will automatically redeploy (if connected via GitHub)
3. Or manually redeploy using Vercel CLI: `vercel --prod`

## Troubleshooting

### Build Fails

- Check Node.js version (18+ required)
- Ensure all dependencies are installed: `npm install`
- Check build logs for specific errors

### PWA Not Installing

- Verify HTTPS is enabled
- Check manifest.json is accessible at `/manifest.json`
- Verify service worker is registered properly

### API Errors

- Ensure Real-Debrid API is accessible
- Check API key is valid
- Verify CORS settings if hosting on custom domain

## Support

For issues specific to deployment platforms:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)

For app-specific issues, open an issue on GitHub.
