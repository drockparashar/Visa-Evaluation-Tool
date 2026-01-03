# Vercel Deployment Guide

## Fixed Issues

### ❌ Original Error

```
ENOENT: no such file or directory, mkdir '/var/task/uploads/temp'
```

### ✅ Solution Applied

1. **Dynamic Upload Directory**: Modified `upload.middleware.js` to use `/tmp` in serverless environments
2. **Document Service Update**: Updated `document.service.js` to handle serverless file system
3. **Vercel Configuration**: Added `vercel.json` with proper serverless function settings

## What Changed

### 1. upload.middleware.js

- Detects if running in Vercel environment
- Uses `/tmp` directory for file uploads in serverless
- Falls back to local `uploads/temp` for development

### 2. document.service.js

- Uses `/tmp` for base upload directory in serverless
- Falls back to local `uploads` for development
- Maintains same functionality across environments

### 3. vercel.json (NEW)

- Configures serverless function settings
- Sets 30-second timeout
- Allocates 1024MB memory

## Environment Variables Required in Vercel

Set these in your Vercel project settings:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

## Deployment Steps

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd server
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-deploy on push

## Important Limitations

### Vercel Serverless Constraints:

1. **File Size**: Maximum 4.5MB request body size
2. **Storage**: `/tmp` has 512MB limit
3. **Persistence**: Files in `/tmp` are deleted after function execution
4. **Timeout**: 30 seconds max (can extend with Pro plan)
5. **Memory**: 1024MB (configurable)

### For Production Use:

If you need permanent file storage, integrate cloud storage:

- **AWS S3**: Best for large files, permanent storage
- **Cloudinary**: Good for images with transformations
- **Vercel Blob**: Native Vercel solution
- **Google Cloud Storage**: Good integration with Gemini API

## Testing After Deployment

1. **Health Check**:

   ```bash
   curl https://your-api.vercel.app/health
   ```

2. **Test Evaluation Endpoint**:
   ```bash
   curl -X POST https://your-api.vercel.app/api/evaluations \
     -F "name=Test User" \
     -F "email=test@example.com" \
     -F "countryCode=PL" \
     -F "visaTypeId=work-permit-c" \
     -F "resume=@resume.pdf"
   ```

## Frontend Configuration

Update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
```

## Troubleshooting

### Issue: Still getting ENOENT errors

- Ensure you've redeployed after the changes
- Check Vercel function logs for actual error

### Issue: Files not processing

- Check Vercel function logs
- Verify file size is under 4.5MB
- Ensure Gemini API key is set correctly

### Issue: Timeout errors

- Increase function timeout in vercel.json
- Consider upgrading to Vercel Pro for 60s timeout
- Optimize Gemini API calls

### Issue: Database connection errors

- Verify MONGODB_URI in Vercel environment variables
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB Atlas network access settings

## Monitoring

View logs in Vercel:

```bash
vercel logs your-deployment-url
```

Or use the Vercel dashboard:
https://vercel.com/dashboard
