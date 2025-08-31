# Netlify Deployment Guide

## Prerequisites

- GitHub account with your project repository
- Netlify account

## Deployment Steps

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository (`gdg`)
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:

   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=out
   ```

### 3. Environment Variables (if needed)

If your app uses environment variables, add them in Netlify dashboard:

1. Go to Site settings > Environment variables
2. Add any required environment variables

### 4. Custom Domain (optional)

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Build Configuration

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18 (configured in netlify.toml)

## Important Notes

- The app is configured for static export (`output: 'export'`)
- Images are set to unoptimized mode for static hosting
- All routes will redirect to index.html for SPA behavior
- Security headers are configured in netlify.toml

## Troubleshooting

- If build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify the out directory is generated after local build
