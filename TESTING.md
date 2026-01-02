# Testing Guide

## Prerequisites

1. **MongoDB** - Ensure MongoDB is running locally or have a MongoDB Atlas connection string
2. **Gemini API Key** - Get from https://makersuite.google.com/app/apikey
3. **Node.js** - Version 18+ recommended

## Backend Setup & Testing

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/visa-evaluation
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/visa-evaluation

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# CORS (optional - defaults to http://localhost:3000)
CLIENT_URL=http://localhost:3000
```

### 3. Start Backend Server

```bash
npm run dev
```

Expected output:

```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### 4. Test Backend Endpoints

#### Test 1: Get All Countries

```bash
curl http://localhost:5000/api/countries
```

Expected: JSON array with 6 countries (IE, PL, DE, US, CA, AU)

#### Test 2: Get Visa Types for a Country

```bash
curl http://localhost:5000/api/countries/IE/visa-types
```

Expected: JSON array with visa types for Ireland

#### Test 3: Submit Evaluation (using Postman or similar)

Import `server/postman-collection.json` into Postman, or use curl:

```bash
# Note: This is a multipart/form-data request
# Use Postman for easier testing with file uploads

POST http://localhost:5000/api/evaluations
Content-Type: multipart/form-data

Form fields:
- country: IE
- visaType: Work Permit
- userInfo: {"name":"John Doe","email":"john@example.com","phone":"123456789"}
- documents: [file uploads]
```

Expected: JSON response with evaluation results including score, summary, strengths, weaknesses, and suggestions.

## Frontend Setup & Testing

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment

Create `.env.local` file in `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

Expected output:

```
▲ Next.js 16.1.1
- Local: http://localhost:3000
```

## End-to-End Testing

### Test Flow 1: Complete Visa Evaluation

1. **Home Page** - http://localhost:3000

   - ✅ Verify Hero section displays
   - ✅ Verify 6 country cards are visible
   - ✅ Click on any country card

2. **Visa Type Modal**

   - ✅ Modal opens showing visa types for selected country
   - ✅ Select a visa type (e.g., "Work Permit")
   - ✅ Click "Continue"

3. **Evaluation Form** - http://localhost:3000/evaluate

   - ✅ Verify country and visa type display correctly
   - ✅ Fill in user information:
     - Name: Your Name
     - Email: your@email.com
     - Phone: +1234567890
   - ✅ Upload required documents:
     - Upload PDF files (max 10MB each)
     - Verify file previews appear
     - Test removing a file
   - ✅ Verify "Submit Evaluation" button is disabled until all fields are filled
   - ✅ Click "Submit Evaluation"
   - ✅ Verify upload progress bar appears
   - ✅ Wait for submission (may take 10-30 seconds due to AI processing)

4. **Results Page** - http://localhost:3000/results/[evaluationId]
   - ✅ Verify score circle displays with correct score
   - ✅ Verify color coding (red < 40, orange 40-65, green > 65)
   - ✅ Read evaluation summary
   - ✅ Check strengths list
   - ✅ Check weaknesses/areas for improvement
   - ✅ Check recommendations
   - ✅ Verify user details section shows correct info
   - ✅ Test "Start New Evaluation" button
   - ✅ Test "Back to Home" button

### Test Flow 2: Navigation & State Management

1. Start at home page
2. Select a country, close modal without selecting visa type
3. Select same country again - verify modal reopens
4. Select visa type and continue
5. On evaluation form, refresh page
6. Verify you're redirected to home (context lost)
7. Complete flow normally

### Test Flow 3: Error Handling

1. **File Upload Errors**

   - Try uploading file > 10MB - should show error toast
   - Try uploading non-PDF file - should show error toast
   - Try submitting without all documents - button should be disabled

2. **Network Errors**

   - Stop backend server
   - Try to load home page - should show error
   - Try to submit form - should show error toast

3. **Invalid Evaluation ID**
   - Navigate to http://localhost:3000/results/invalid-id
   - Should show "Evaluation Not Found" message

## Backend Testing (Optional)

### Using the Test Setup Script

```bash
cd server
node test-setup.js
```

This script will:

- Test MongoDB connection
- Test Gemini API key
- Create sample documents in database
- Verify all routes are accessible

### Manual Database Verification

```bash
# Using MongoDB shell
mongosh

use visa-evaluation
db.evaluations.find().pretty()
```

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**

- Ensure MongoDB is running: `mongod` or check MongoDB Atlas
- Verify MONGODB_URI in `.env`

### Issue: Gemini API Errors

**Solution:**

- Verify GEMINI_API_KEY is valid
- Check API quota at https://makersuite.google.com/
- Ensure you have API access enabled

### Issue: CORS Errors

**Solution:**

- Verify CLIENT_URL in backend `.env`
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`
- Ensure backend is running on port 5000

### Issue: File Upload Fails

**Solution:**

- Check uploads/ directory exists in server/
- Verify file size < 10MB
- Ensure file is PDF format
- Check server logs for specific error

### Issue: Frontend Shows "Network Error"

**Solution:**

- Verify backend is running: http://localhost:5000/api/countries
- Check browser console for specific error
- Verify NEXT_PUBLIC_API_URL is correct

## Performance Notes

- **AI Evaluation Time**: 10-30 seconds depending on document complexity
- **File Upload**: Progress bar shows upload status
- **MongoDB Queries**: Should be < 100ms for most operations
- **Frontend Rendering**: First load may be slower due to SSR

## Next Steps

After successful testing:

1. ✅ All features working correctly
2. 🔄 Consider implementing:
   - PDF report generation
   - Email functionality
   - Admin dashboard
   - Payment integration (if required)
   - Partner API keys management
3. 🚀 Deploy to production:
   - Frontend: Vercel/Netlify
   - Backend: Railway/Render/AWS
   - Database: MongoDB Atlas

## Test Checklist

- [ ] Backend starts successfully
- [ ] MongoDB connection established
- [ ] Gemini API key working
- [ ] Countries API returns data
- [ ] Visa types API returns data
- [ ] Home page loads
- [ ] Country selection works
- [ ] Visa type modal works
- [ ] Evaluation form validation works
- [ ] File upload works
- [ ] Form submission succeeds
- [ ] Results page displays correctly
- [ ] Score circle animates
- [ ] All feedback sections show data
- [ ] Navigation between pages works
- [ ] Error handling works
- [ ] Responsive design works (mobile/tablet/desktop)
