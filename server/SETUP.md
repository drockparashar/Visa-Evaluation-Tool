# 🚀 Backend Setup Guide

## Step 1: Configure Environment Variables

1. Open `server/.env` file
2. Add your **Gemini API Key**:

   - Get it from: https://makersuite.google.com/app/apikey
   - Add to `.env`: `GEMINI_API_KEY=your_key_here`

3. Configure MongoDB:
   - **Option A (Local)**: Keep default `mongodb://localhost:27017/visa-evaluation`
   - **Option B (Atlas)**: Replace with your MongoDB Atlas connection string

## Step 2: Install MongoDB (if using local)

### Windows:

```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

### Start MongoDB:

```bash
mongod
```

## Step 3: Install Dependencies & Test

```bash
cd server
npm install
node test-setup.js
```

You should see:

- ✅ Countries loaded
- ✅ MongoDB connected
- ✅ Gemini API connected

## Step 4: Start the Server

```bash
npm run dev
```

Server will start at: http://localhost:5000

## Step 5: Test the API

### Option A: Use Postman

1. Import `postman-collection.json` into Postman
2. Test endpoints

### Option B: Use curl

```bash
# Get countries
curl http://localhost:5000/api/countries

# Health check
curl http://localhost:5000/health
```

## Common Issues

### ❌ MongoDB Connection Failed

- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`

### ❌ Gemini API Error

- Verify your API key is correct
- Check you have API credits

### ❌ Port Already in Use

- Change PORT in `.env` to different number (e.g., 5001)

## Next Steps

Backend is ready! Now you can:

1. Build the frontend
2. Test with Postman
3. Deploy to production
