# Multi-Country Visa Evaluation Tool

A full-stack web application that helps users assess their likelihood of obtaining different types of visas across multiple countries using AI-powered evaluation.

## 🎯 Features

- **Multi-Country Support**: Ireland, Poland, Germany, USA, Canada, Australia
- **Multiple Visa Types**: Work Permits, Student Visas, Tourist Visas, Business Visas, Family Reunion, and more
- **AI-Powered Evaluation**: Uses Google Gemini 1.5 Flash for intelligent visa assessment
- **Document Upload**: Support for multiple PDF document uploads
- **Detailed Results**: Comprehensive scoring with strengths, weaknesses, and recommendations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Backend (Express + MongoDB)

- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API
- **File Handling**: Multer + pdf-parse
- **Architecture**: Service layer pattern with controllers, services, and models

### Frontend (Next.js + TypeScript)

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Context API
- **Form Handling**: react-hook-form + zod
- **HTTP Client**: axios

## 📁 Project Structure

```
Opensphere-Assignment/
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/        # Configuration files (countries, database)
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Business logic (Gemini, evaluation)
│   │   ├── middleware/    # Express middleware
│   │   └── app.js         # Express app configuration
│   ├── uploads/           # Uploaded files storage
│   ├── server.js          # Entry point
│   └── package.json
│
└── client/                # Frontend Next.js application
    ├── app/               # Next.js app router pages
    │   ├── page.tsx       # Home page
    │   ├── evaluate/      # Evaluation form page
    │   └── results/       # Results page
    ├── components/        # React components
    │   ├── ui/           # Reusable UI components
    │   ├── home/         # Home page components
    │   ├── evaluation/   # Form components
    │   └── results/      # Results components
    ├── lib/              # Utilities and services
    │   ├── api/          # API client functions
    │   └── types/        # TypeScript types
    ├── context/          # React context providers
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
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/visa-evaluation
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

Visit http://localhost:3000 to see the application!

## 📖 User Flow

1. **Home Page** - Browse available countries and select one
2. **Visa Type Selection** - Choose the type of visa you need
3. **Evaluation Form** - Fill in personal details and upload required documents
4. **AI Processing** - Gemini AI evaluates your application (10-30 seconds)
5. **Results Page** - View your score, strengths, weaknesses, and recommendations

## 🔧 API Endpoints

### Countries

- `GET /api/countries` - Get all countries
- `GET /api/countries/:countryCode/visa-types` - Get visa types for a country

### Evaluations

- `POST /api/evaluations` - Submit evaluation (multipart/form-data)
- `GET /api/evaluations/:id` - Get evaluation by ID
- `GET /api/evaluations` - Get all evaluations (with pagination)

## 🎨 Components Overview

### UI Components

- **Button** - Styled button with variants (primary, secondary, outline)
- **Card** - Container with header and content sections
- **Input** - Form input with error handling
- **Modal** - Reusable modal dialog
- **LoadingSpinner** - Loading indicator

### Feature Components

- **CountryCard** - Displays country with flag and visa types count
- **VisaTypeModal** - Modal for selecting visa type
- **EvaluationForm** - Main form with validation and file uploads
- **ScoreCircle** - Animated circular progress for score
- **SummaryCard** - Displays AI evaluation summary
- **StrengthsList** - Shows application strengths
- **WeaknessesList** - Shows areas for improvement
- **SuggestionsList** - Shows AI recommendations

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

Quick test:

```bash
# Test backend
cd server
curl http://localhost:5000/api/countries

# Test frontend
Open http://localhost:3000 in browser
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for frontend origin
- **File Validation** - Size and type restrictions
- **Input Validation** - Zod schema validation
- **Error Handling** - Centralized error middleware
- **Rate Limiting** - Prevents abuse (recommended for production)

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
- Blue Card
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
- Express Entry

### Australia (AU)

- Skilled Work Visa
- Student Visa
- Tourist Visa
- Working Holiday Visa

## 🚧 Future Enhancements

- [ ] PDF report generation
- [ ] Email functionality for results
- [ ] Admin dashboard for reviewing applications
- [ ] Partner API keys management
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Real-time evaluation status updates
- [ ] Document OCR for automatic data extraction
- [ ] Comparison tool for multiple countries
- [ ] Historical application tracking

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB is running
- Verify `.env` file exists with correct values
- Check port 5000 is not in use

### Frontend shows "Network Error"

- Ensure backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### File upload fails

- Verify file is PDF format
- Check file size is under 10MB
- Ensure `uploads/` directory exists in server folder

### AI evaluation takes too long

- Normal processing time is 10-30 seconds
- Check Gemini API quota
- Verify API key is valid

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Development

Built with ❤️ using:

- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini](https://deepmind.google/technologies/gemini/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📧 Support

For questions or issues:

1. Check [TESTING.md](./TESTING.md) for common issues
2. Review error messages in server/frontend logs
3. Verify environment configuration

---

**Happy Coding! 🎉**
