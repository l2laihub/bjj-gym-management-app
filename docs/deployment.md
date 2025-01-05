# Deployment Guide

## Overview

This guide provides instructions for deploying the BJJ Gym Management Application to various environments. The application is built with React and uses Supabase as the backend service.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase account
- Hosting platform account (e.g., Vercel, Netlify, or similar)

## Environment Setup

1. **Environment Variables**

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Production Environment Variables**

Configure the same environment variables in your hosting platform's dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Build Process

1. **Local Build**

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

2. **Build Output**

The build process will create a `dist` directory containing the optimized production build:

```
dist/
├── assets/
│   ├── js/
│   ├── css/
│   └── images/
├── index.html
└── ...
```

## Deployment Options

### 1. Vercel Deployment

1. **Setup**
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Set the build command to `npm run build`
   - Set the output directory to `dist`

2. **Deploy**
   - Push to main branch for automatic deployment
   - Use Vercel CLI for manual deployment:
     ```bash
     vercel
     ```

### 2. Netlify Deployment

1. **Setup**
   - Connect your GitHub repository to Netlify
   - Configure environment variables in Netlify dashboard
   - Set the build command to `npm run build`
   - Set the publish directory to `dist`

2. **Deploy**
   - Push to main branch for automatic deployment
   - Use Netlify CLI for manual deployment:
     ```bash
     netlify deploy
     ```

### 3. Manual Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Upload to Web Server**
   - Upload the contents of the `dist` directory to your web server
   - Configure your web server to serve `index.html` for all routes
   - Set up HTTPS certificates

## Post-Deployment Checklist

1. **Verify Environment**
   - Check environment variables are set correctly
   - Verify Supabase connection
   - Test authentication flow

2. **Performance Checks**
   - Run Lighthouse audit
   - Check page load times
   - Verify API response times

3. **Security Checks**
   - Verify HTTPS is enabled
   - Check Content Security Policy
   - Test authentication and authorization

4. **Functionality Tests**
   - Test all major features
   - Verify form submissions
   - Check data persistence
   - Test real-time updates

## Monitoring and Maintenance

1. **Performance Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor API performance
   - Track user metrics

2. **Backup Procedures**
   - Regular database backups via Supabase dashboard
   - Configuration backups
   - Document recovery procedures

3. **Update Procedures**
   - Document update process
   - Plan for zero-downtime updates
   - Maintain update history

## Troubleshooting

1. **Common Issues**

   - **Build Failures**
     - Check Node.js version
     - Verify dependencies
     - Check environment variables

   - **Runtime Errors**
     - Check browser console
     - Verify API connections
     - Check authentication state

   - **Performance Issues**
     - Analyze bundle size
     - Check API response times
     - Monitor resource usage

2. **Debug Procedures**
   - Enable source maps in production
   - Use logging strategically
   - Monitor error reports

## Rollback Procedures

1. **Version Control**
   - Maintain release tags
   - Document deployment versions
   - Keep deployment artifacts

2. **Rollback Steps**
   ```bash
   # Revert to previous version
   git checkout <previous-tag>
   
   # Rebuild
   npm install
   npm run build
   
   # Deploy
   # (platform-specific deployment command)
   ```

## Security Considerations

1. **Environment Security**
   - Use secure environment variables
   - Rotate API keys regularly
   - Implement proper CORS policies

2. **Access Control**
   - Configure proper authentication
   - Set up role-based access
   - Monitor access logs

3. **Data Protection**
   - Enable database encryption
   - Implement backup strategies
   - Monitor data access

## Scaling Considerations

1. **Performance Optimization**
   - Implement caching strategies
   - Optimize database queries
   - Use CDN for static assets

2. **Resource Management**
   - Monitor resource usage
   - Plan for increased load
   - Implement auto-scaling

## Continuous Integration/Deployment

1. **CI/CD Pipeline**
   - Set up GitHub Actions workflow
   - Configure automated testing
   - Implement deployment automation

2. **Quality Gates**
   - Code quality checks
   - Security scans
   - Performance benchmarks

## Production Best Practices

1. **Error Handling**
   - Implement global error boundary
   - Set up error logging service
   - Create user-friendly error pages

2. **Performance**
   - Enable compression
   - Optimize asset delivery
   - Implement caching strategy

3. **Monitoring**
   - Set up uptime monitoring
   - Configure performance monitoring
   - Implement error tracking

## Deployment Environments

1. **Development**
   - Local development setup
   - Development database
   - Feature testing

2. **Staging**
   - Mirror of production
   - Testing environment
   - Pre-deployment verification

3. **Production**
   - Live environment
   - Production database
   - Monitoring and alerts
