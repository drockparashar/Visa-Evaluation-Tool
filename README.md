# Multi-Country Visa Evaluation Tool

A comprehensive full-stack web application that helps users assess their visa eligibility across multiple countries using AI-powered evaluation, with features for partner API integration, admin dashboard, and instant self-service API key generation.

🌐 **Live Demo**: [https://visa-evaluation-tool-v7lp.vercel.app](https://visa-evaluation-tool-v7lp.vercel.app)

## 🎯 Features

### Core Features

- **Multi-Country Support**: Ireland, Poland, Germany, USA, Canada, Australia
- **Multiple Visa Types**: Work Permits, Student Visas, Tourist Visas, Business Visas, Family Reunion, and more
- **AI-Powered Evaluation**: Uses Google Gemini 2.5 Flash for intelligent visa assessment with 8192 token output
- **Document Upload**: PDF document upload support (currently resume-only, extensible for multiple documents)
- **Detailed Results**: Comprehensive scoring with strengths, weaknesses, and actionable recommendations
- **PDF Report Generation**: Download evaluation results as professional PDF reports
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### API & Integration Features

- **X-API-Key Authentication**: Secure partner API access with rate limiting
- **Instant API Key Generation**: Self-service portal for immediate API key creation (no email verification required)
- **Rate Limiting**: Configurable request limits per API key (default: 100 requests/day)
- **Usage Tracking**: Real-time monitoring of API key usage and statistics

### Admin Dashboard

- **Admin Authentication**: JWT-based secure login system
- **API Keys Management**: Create, list, update, and revoke API keys
- **Analytics Dashboard**: Real-time statistics and usage insights
- **Interactive Charts**: Usage trends, country distribution, visa type analytics (Recharts)
- **Partner Management**: Track partner information and API usage

## 🏗️ Architecture

### Backend (Express + MongoDB)

- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini 2.5 Flash API
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **File Handling**: Multer + pdf-parse for document processing
- **PDF Generation**: PDFKit for evaluation reports
- **Security**: Helmet.js, CORS, rate limiting, API key hashing
- **Architecture**: Service layer pattern with controllers, services, and models

### Frontend (Next.js + TypeScript)

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Context API (EvaluationContext, AdminAuthContext)
- **Form Handling**: react-hook-form + zod validation
- **HTTP Client**: axios with interceptors
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast messages
- **Icons**: Lucide React

## 📁 Project Structure

```
Opensphere-Assignment/
├── server/                          # Backend Express application
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── database.js          # MongoDB connection
│   │   │   ├── constants.js         # App constants
│   │   │   └── countries.js         # Countries & visa types data
│   │   │
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── Evaluation.js        # Evaluation model
│   │   │   ├── Admin.js             # Admin user model
│   │   │   ├── ApiKey.js            # API key model
│   │   │   └── ApiKeyRequest.js     # API key request tracking
│   │   │
│   │   ├── services/                # Business logic layer
│   │   │   ├── document.service.js  # PDF extraction
│   │   │   ├── gemini.service.js    # AI evaluation
│   │   │   ├── evaluation.service.js # Main orchestrator
│   │   │   ├── apiKey.service.js    # API key operations
│   │   │   ├── analytics.service.js # Dashboard analytics
│   │   │   └── pdf.service.js       # PDF report generation
│   │   │
│   │   ├── controllers/             # Route handlers
│   │   │   ├── countries.controller.js
│   │   │   ├── evaluations.controller.js
│   │   │   ├── auth.controller.js   # Admin authentication
│   │   │   ├── apiKeys.controller.js # API key management
│   │   │   ├── analytics.controller.js # Dashboard analytics
│   │   │   └── publicApiKeys.controller.js # Self-service
│   │   │
│   │   ├── routes/                  # Express routes
│   │   │   ├── countries.routes.js
│   │   │   ├── evaluations.routes.js
│   │   │   ├── auth.routes.js       # Admin auth routes
│   │   │   ├── admin.routes.js      # Protected admin routes
│   │   │   └── publicApiKeys.routes.js # Public API key routes
│   │   │
│   │   ├── middleware/              # Express middleware
│   │   │   ├── error.middleware.js  # Error handling
│   │   │   ├── upload.middleware.js # File upload
│   │   │   ├── apiKey.middleware.js # API key validation
│   │   │   └── auth.middleware.js   # JWT authentication
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   └── jwt.js               # JWT token utilities
│   │   │
│   │   ├── scripts/                 # CLI scripts
│   │   │   ├── create-admin.js      # Create admin user
│   │   │   └── generate-api-key.js  # Generate API key
│   │   │
│   │   └── app.js                   # Express app configuration
│   │
│   ├── uploads/                     # Uploaded files storage
│   ├── server.js                    # Entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
└── client/                          # Frontend Next.js application
    ├── app/                         # Next.js app router
    │   ├── page.tsx                 # Home page
    │   ├── evaluate/                # Evaluation form
    │   │   └── page.tsx
    │   ├── results/                 # Results page
    │   │   └── [evaluationId]/
    │   │       └── page.tsx
    │   ├── admin/                   # Admin dashboard
    │   │   ├── login/               # Admin login
    │   │   │   └── page.tsx
    │   │   ├── dashboard/           # Dashboard home
    │   │   │   ├── layout.tsx       # Sidebar layout
    │   │   │   └── page.tsx
    │   │   ├── api-keys/            # API keys management
    │   │   │   └── page.tsx
    │   │   └── analytics/           # Analytics page
    │   │       └── page.tsx
    │   └── api-keys/                # Public API key portal
    │       ├── request/             # Request form
    │       │   └── page.tsx
    │       └── verify/              # Verification (deprecated)
    │           └── [token]/
    │               └── page.tsx
    │
    ├── components/                  # React components
    │   ├── ui/                      # Reusable UI components
    │   ├── home/                    # Home page components
    │   ├── evaluation/              # Form components
    │   ├── results/                 # Results components
    │   └── admin/                   # Admin components
    │       ├── AdminProtectedRoute.tsx
    │       └── ...
    │
    ├── context/                     # React context providers
    │   ├── EvaluationContext.tsx    # Evaluation state
    │   └── AdminAuthContext.tsx     # Admin authentication
    │
    ├── lib/                         # Utilities and services
    │   ├── api/                     # API client functions
    │   │   ├── axios.ts
    │   │   ├── countries.ts
    │   │   └── evaluations.ts
    │   └── types/                   # TypeScript types
    │       ├── country.ts
    │       ├── evaluation.ts
    │       └── api.ts
    │
    ├── .env.local                   # Environment variables
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Opensphere-Assignment

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Backend** - Create `server/.env`:

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

# JWT Authentication
JWT_SECRET=your-very-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# For production deployment on Vercel, add your frontend URLs:
# ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

**Frontend** - Create `client/.env.local`:

```env
# For local development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# For production (set in Vercel dashboard)
# NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### 3. Run the Application

**Option A: Quick Start (Recommended)**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Option B: Create Admin User (For Dashboard Access)**

```bash
# Create first admin user
cd server
node src/scripts/create-admin.js

# Credentials will be displayed:
# Email: admin@visaeval.com
# Password: admin123
```

Visit:

- **Main App**: http://localhost:3000 or [Production](https://visa-evaluation-tool-v7lp.vercel.app)
- **Admin Dashboard**: http://localhost:3000/admin/login
- **API Key Request**: http://localhost:3000/api-keys/request
- **Backend API**: http://localhost:5000 or [Production](https://visa-evaluation-tool.vercel.app)

## 🚀 Deployment

### Deploying to Vercel

Both frontend and backend are deployed on Vercel.

#### Backend Deployment

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Deploy backend"
   git push
   ```

2. **Create new Vercel project**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Select `server` as root directory

3. **Configure Environment Variables**

   - Go to Settings → Environment Variables
   - Add all variables from `server/.env`:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_uri
     GEMINI_API_KEY=your_gemini_key
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=7d
     CLIENT_URL=https://your-frontend.vercel.app
     MAX_FILE_SIZE_MB=10
     ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
     RATE_LIMIT_WINDOW_MS=900000
     RATE_LIMIT_MAX_REQUESTS=100
     ```

4. **Deploy**
   - Click "Deploy"
   - Note your backend URL (e.g., `https://visa-evaluation-tool.vercel.app`)

#### Frontend Deployment

1. **Create new Vercel project for frontend**

   - Import same repository
   - Select `client` as root directory

2. **Configure Environment Variables**

   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
     ```

3. **Deploy**

   - Click "Deploy"
   - Your frontend will be live at `https://your-frontend.vercel.app`

4. **Update Backend CORS**
   - Go back to backend project
   - Update `ALLOWED_ORIGINS` to include your frontend URL
   - Redeploy backend

#### Important Notes

- **Environment Variables**: Must be set in Vercel dashboard, not just in `.env` files
- **CORS**: Backend must explicitly allow frontend URL in `ALLOWED_ORIGINS`
- **MongoDB**: Use MongoDB Atlas (not local MongoDB) for production
- **File Uploads**: Vercel has serverless function limits (10MB max payload)
- **Redeployment**: Trigger with `git push` or manual redeploy in Vercel dashboard

## 📖 User Flow

### Public User Flow

1. **Home Page** - Browse available countries and select one
2. **Visa Type Selection** - Choose the type of visa you need
3. **Evaluation Form** - Fill in personal details and upload resume (PDF)
4. **AI Processing** - Gemini AI evaluates your application (10-30 seconds)
5. **Results Page** - View your score, strengths, weaknesses, and recommendations
6. **Download PDF** - Get a professional PDF report of your evaluation

### API Partner Flow

1. **Request API Key** - Visit `/api-keys/request` and fill the form
2. **Get Instant Key** - Receive API key immediately (no email verification)
3. **Copy Key** - One-time display, save it securely
4. **Integrate API** - Use X-API-Key header in requests
5. **Monitor Usage** - Track requests via admin dashboard

### Admin Flow

1. **Login** - Access admin dashboard at `/admin/login`
2. **View Dashboard** - See real-time statistics and metrics
3. **Manage API Keys** - Create, update, revoke partner keys
4. **View Analytics** - Interactive charts for usage trends
5. **Monitor System** - Track evaluations and performance

## 🔧 API Endpoints

### Public Endpoints

#### Countries

- `GET /api/countries` - Get all available countries
- `GET /api/countries/:countryCode/visa-types` - Get visa types for a specific country

#### Evaluations (Requires X-API-Key)

- `POST /api/evaluations` - Submit evaluation (multipart/form-data)
  - Headers: `X-API-Key: your_api_key`
  - Body: FormData with user details and resume file
- `GET /api/evaluations/:id` - Get evaluation by ID
- `GET /api/evaluations` - Get all evaluations (with pagination)
- `GET /api/evaluations/:id/download` - Download evaluation as PDF

#### API Key Self-Service

- `POST /api/api-keys/request` - Request new API key (instant, no verification)
  - Body: `{ name, email, organization, useCase, website }`
  - Returns: API key (shown only once)

### Admin Endpoints (Requires JWT)

#### Authentication

- `POST /api/auth/login` - Admin login
  - Body: `{ email, password }`
  - Returns: JWT token
- `GET /api/auth/me` - Get current admin profile
- `POST /api/auth/logout` - Logout (client-side token removal)

#### API Keys Management

- `POST /api/admin/api-keys` - Create new API key
- `GET /api/admin/api-keys` - List all keys (with pagination, search, filters)
- `GET /api/admin/api-keys/:keyId` - Get key details
- `PUT /api/admin/api-keys/:keyId` - Update key settings
- `DELETE /api/admin/api-keys/:keyId` - Revoke key
- `GET /api/admin/api-keys/:keyId/stats` - Get key usage statistics

#### Analytics

- `GET /api/admin/analytics/dashboard` - Dashboard statistics
- `GET /api/admin/analytics/usage` - Usage over time (default: 30 days)
- `GET /api/admin/analytics/top-keys` - Top API keys by usage
- `GET /api/admin/analytics/countries` - Country distribution
- `GET /api/admin/analytics/visa-types` - Visa type distribution
- `GET /api/admin/analytics/recent` - Recent activity

## 🔒 Security Features

- **Helmet.js** - Security headers for HTTP requests
- **CORS** - Configured for specific frontend origins (localhost + production URLs)
- **API Key Authentication** - Hashed API keys using bcrypt (salt rounds: 10)
- **JWT Authentication** - Secure admin authentication with 7-day expiration
- **Password Hashing** - bcrypt with salt rounds for admin passwords
- **Rate Limiting** - 100 requests/day per API key (configurable), plus global rate limiting (100 req/15min)
- **File Validation** - Size (10MB max) and type (PDF-only) restrictions
- **Input Validation** - Zod schema validation on frontend, Mongoose validation on backend
- **Error Handling** - Centralized error middleware with production/development modes
- **Environment Variables** - Sensitive data stored in .env files (not committed to git)
- **HTTPS Ready** - Deployed on Vercel with automatic SSL certificates

## 📊 Supported Countries & Visas

### Ireland (IE)

- Work Permit
- Student Visa
- Critical Skills Employment Permit
- Tourist Visa
- Family Reunion

### Poland (PL)

- Work Permit
- Student Visa
- Tourist Visa
- Business Visa

### Germany (DE)

- Work Visa
- Student Visa
- Blue Card (EU)
- Tourist Visa
- Business Visa

### USA (US)

- H-1B Work Visa
- Student Visa (F-1)
- Tourist Visa (B-2)
- Business Visa (B-1)

### Canada (CA)

- Work Permit
- Study Permit
- Visitor Visa
- Express Entry (Permanent Residence)

### Australia (AU)

- Skilled Work Visa (Subclass 189/190)
- Student Visa (Subclass 500)
- Tourist Visa (Subclass 600)
- Working Holiday Visa (Subclass 417)

## 🎨 Components Overview

### Public UI Components

**Base Components:**

- **Button** - Styled button with variants (primary, secondary, outline, ghost)
- **Card** - Container with header and content sections
- **Input** - Form input with error states and validation
- **Modal** - Reusable dialog with overlay
- **LoadingSpinner** - Animated loading indicator

**Feature Components:**

- **CountryCard** - Interactive country card with flag and visa count
- **VisaTypeModal** - Modal for visa type selection
- **EvaluationForm** - Multi-step form with file upload
- **FilePreview** - PDF file preview with validation
- **ScoreCircle** - Animated circular progress indicator
- **SummaryCard** - AI evaluation summary display
- **StrengthsList** - Visual list of application strengths
- **WeaknessesList** - Areas for improvement display
- **SuggestionsList** - AI recommendations with icons
- **PDFDownloadButton** - Generate and download PDF reports

### Admin Components

**Dashboard Components:**

- **AdminProtectedRoute** - Route protection wrapper
- **AdminLayout** - Sidebar navigation layout
- **StatCard** - Metric display cards with icons
- **QuickAction** - Dashboard quick action links
- **InfoRow** - Key-value information display

**Data Management:**

- **ApiKeysTable** - Sortable table with API keys
- **CreateKeyModal** - Form for creating new API keys
- **UsageChart** - Line chart for usage trends (Recharts)
- **DistributionChart** - Pie chart for country/visa distribution
- **BarChart** - Bar chart for top keys/visa types

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

**Quick Backend Test:**

```bash
cd server
curl http://localhost:5000/api/countries
```

**Quick Frontend Test:**

```bash
# Open browser and visit:
http://localhost:3000

# Test admin login:
http://localhost:3000/admin/login
# Email: admin@visaeval.com
# Password: admin123

# Test API key request:
http://localhost:3000/api-keys/request
```

**API Integration Test:**

```bash
# Get API key from http://localhost:3000/api-keys/request first
# Then test evaluation endpoint:

curl -X POST http://localhost:5000/api/evaluations \
  -H "X-API-Key: your_api_key_here" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "age=28" \
  -F "nationality=Indian" \
  -F "country=IE" \
  -F "visaType=work_permit" \
  -F "educationLevel=bachelors" \
  -F "workExperience=5" \
  -F "languageProficiency=advanced" \
  -F "resume=@path/to/resume.pdf"

# Production API:
# Replace localhost:5000 with https://visa-evaluation-tool.vercel.app
```

## 🚧 Current Features & Future Enhancements

### ✅ Implemented Features

- [x] Multi-country visa evaluation system (6 countries)
- [x] AI-powered assessment using Gemini 2.5 Flash (8192 token output)
- [x] PDF document upload and parsing (resume-only, 10MB limit)
- [x] Interactive results with scoring (0-100 scale)
- [x] PDF report generation with PDFKit
- [x] X-API-Key authentication for partners
- [x] API key management system (CRUD operations)
- [x] Rate limiting (100 requests/day default, configurable per key)
- [x] Admin dashboard with JWT authentication
- [x] Instant API key generation (no email verification)
- [x] Usage analytics and interactive charts (Recharts)
- [x] Partner information tracking
- [x] Responsive mobile-friendly design
- [x] Production deployment on Vercel (frontend + backend)
- [x] CORS configuration for multiple origins
- [x] Real-time statistics and metrics
- [x] Secure password hashing and token management

### 🔮 Future Enhancements

- [ ] Email notifications for evaluations (Nodemailer configured but not active)
- [ ] Multi-document support (currently resume-only, but backend supports all types)
- [ ] Email verification for API key requests (infrastructure ready, currently instant)
- [ ] Two-factor authentication for admins
- [ ] Advanced admin user management (multiple admin roles)
- [ ] Custom rate limit configuration UI per key
- [ ] IP whitelisting/blacklisting for API keys
- [ ] Webhook support for evaluation completion notifications
- [ ] Multi-language support (i18n/internationalization)
- [ ] Document OCR for automatic data extraction from scanned documents
- [ ] Real-time evaluation status via WebSockets
- [ ] Comparison tool for multiple countries side-by-side
- [ ] Historical application tracking for returning users
- [ ] Payment integration for premium features (Stripe/PayPal)
- [ ] Advanced analytics (custom date ranges, CSV exports, data visualization)
- [ ] API versioning (v2, v3) with backward compatibility
- [ ] Comprehensive audit logs for all admin actions
- [ ] Partner dashboard (self-service analytics portal)
- [ ] Mobile native apps (React Native)
- [ ] Document templates and auto-fill suggestions
- [ ] Integration with government immigration APIs
- [ ] AI chatbot for visa queries

## 🐛 Troubleshooting

### Backend Issues

**Backend won't start**

- Check MongoDB is running (`mongod` or MongoDB Atlas connection)
- Verify `.env` file exists with all required values
- Check port 5000 is not in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Ensure Node.js version is 18+

**MongoDB connection fails**

- Local MongoDB: Ensure service is running
- Atlas: Check connection string format and network access
- Verify firewall settings

**Gemini API errors**

- Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check API quota limits
- Ensure stable internet connection

### Frontend Issues

**Frontend shows "Network Error"**

- Ensure backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL
  - Local: `http://localhost:5000/api`
  - Production: Set in Vercel environment variables dashboard
- Check browser console for CORS errors
- Clear browser cache and restart dev server (`Ctrl+C` then `npm run dev`)
- Verify CORS origins in backend `.env` include your frontend URL

**Admin login fails**

- Run `node src/scripts/create-admin.js` to create admin user
- Use credentials: `admin@visaeval.com` / `admin123`
- Check JWT_SECRET is set in backend `.env`
- Clear localStorage and try again

**API key not working**

- Ensure X-API-Key header is included in requests
- Verify key is active (not revoked)
- Check rate limit hasn't been exceeded
- API key format: `veval_{keyId}_{secret}`

### Upload Issues

**File upload fails**

- Verify file is PDF format only
- Check file size is under 10MB
- Ensure `uploads/` directory exists in server folder
- Check server logs for detailed error messages

**PDF parsing fails**

- Ensure PDF is not encrypted/password protected
- Check PDF is not corrupted
- Try with a different PDF file

### Evaluation Issues

**AI evaluation takes too long**

- Normal processing time: 10-30 seconds
- Check Gemini API response times
- Verify network connection
- Review server logs for bottlenecks

**Evaluation fails**

- Check all required fields are filled
- Ensure resume file is uploaded
- Verify country and visa type are selected
- Check server error logs for details

### Admin Dashboard Issues

**Charts not loading**

- Ensure there is data in the database
- Check browser console for errors
- Verify API endpoints are responding
- Check that analytics service is working

**Can't create API keys**

- Ensure you're logged in as admin
- Check MongoDB connection
- Verify all required fields are filled
- Review backend logs for validation errors

### General Debugging

**Enable detailed logging:**

```bash
# Backend
NODE_ENV=development npm run dev

# Check logs in terminal
```

**Clear everything and restart:**

```bash
# Clear backend cache
cd server
rm -rf node_modules package-lock.json
npm install

# Clear frontend cache
cd client
rm -rf node_modules .next package-lock.json
npm install

# Restart both servers
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🌟 Key Highlights

- ✅ **Production Ready**: Fully deployed on Vercel with HTTPS
- ✅ **AI-Powered**: Google Gemini 2.5 Flash integration
- ✅ **Secure**: JWT auth, bcrypt hashing, rate limiting, CORS protection
- ✅ **Scalable**: RESTful API with proper architecture patterns
- ✅ **Modern Stack**: Next.js 16, TypeScript, Tailwind CSS v4
- ✅ **Real-time Analytics**: Interactive charts and dashboards
- ✅ **Developer Friendly**: Comprehensive API docs and examples
- ✅ **Enterprise Features**: API key management, usage tracking, admin portal

## 👨‍💻 Development

### Tech Stack

**Backend:**

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) - Database
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI evaluation
- [Multer](https://github.com/expressjs/multer) - File upload
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF extraction
- [PDFKit](https://pdfkit.org/) - PDF generation
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT auth
- [Helmet.js](https://helmetjs.github.io/) - Security
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting

**Frontend:**

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation
- [axios](https://axios-http.com/) - HTTP client
- [Recharts](https://recharts.org/) - Data visualization
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide React](https://lucide.dev/) - Icons
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Project Statistics

- **Total Files**: 100+ TypeScript/JavaScript files
- **Backend Endpoints**: 25+ REST API routes
- **Frontend Pages**: 10+ pages including admin dashboard
- **Supported Countries**: 6 (Ireland, Poland, Germany, USA, Canada, Australia)
- **Visa Types**: 25+ across all countries
- **Database Models**: 4 (Evaluation, Admin, ApiKey, ApiKeyRequest)
- **UI Components**: 40+ reusable React components
- **Backend Services**: 6 service modules
- **Deployed**: Production-ready on Vercel (frontend + backend)

### Key Directories

```
📦 Backend: server/src/
├── 📂 config/          3 files
├── 📂 controllers/     6 files
├── 📂 models/          4 files
├── 📂 routes/          5 files
├── 📂 services/        5 files
├── 📂 middleware/      4 files
├── 📂 utils/           1 file
└── 📂 scripts/         2 files

📦 Frontend: client/
├── 📂 app/             10+ pages
├── 📂 components/      30+ components
├── 📂 context/         2 contexts
└── 📂 lib/             API utilities
```

## 📚 Documentation

- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[BACKEND-SUMMARY.md](./BACKEND-SUMMARY.md)** - Backend architecture details
- **[ADMIN_DASHBOARD_SUMMARY.md](./ADMIN_DASHBOARD_SUMMARY.md)** - Admin features documentation
- **[API_KEY_USAGE.md](./API_KEY_USAGE.md)** - API key integration guide

## 📧 Support

For questions or issues:

1. Check [TESTING.md](./TESTING.md) for common issues
2. Review error messages in server/frontend logs
3. Verify environment configuration
4. Check MongoDB connection status
5. Ensure all dependencies are installed

## 🤝 Contributing

This project is open for contributions! Areas for improvement:

1. Add more countries and visa types
2. Enhance AI evaluation prompts
3. Improve UI/UX design
4. Add comprehensive test suites
5. Optimize performance
6. Add internationalization (i18n)
7. Implement email notifications
8. Create mobile apps

## 🎯 Use Cases

### For Job Seekers

- Evaluate work visa eligibility
- Compare multiple countries
- Understand visa requirements
- Get AI-powered recommendations

### For Students

- Assess student visa chances
- Find best countries for studies
- Understand documentation needs
- Plan visa application timeline

### For Businesses

- Evaluate employee visa eligibility
- Bulk evaluation via API
- Track application success rates
- Streamline hiring process

### For Immigration Consultants

- Quick preliminary assessments
- Client eligibility screening
- Data-driven recommendations
- Scalable evaluation service

---

**Built with ❤️ using modern web technologies**

**Happy Coding! 🎉**
