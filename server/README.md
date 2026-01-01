# Multi-Country Visa Evaluation API

Backend API for evaluating visa applications across multiple countries using AI-powered assessment.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gemini API key

### Installation

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:

   - `MONGODB_URI`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - Other settings as needed

3. **Start MongoDB** (if using local)

   ```bash
   mongod
   ```

4. **Run the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

Server will start at `http://localhost:5000`

## 📋 API Endpoints

### Countries

- `GET /api/countries` - Get all available countries
- `GET /api/countries/:code` - Get specific country details
- `GET /api/countries/:code/visa-types` - Get visa types for country
- `GET /api/countries/:code/visa-types/:visaId` - Get specific visa type

### Evaluations

- `POST /api/evaluations` - Create new visa evaluation
- `GET /api/evaluations/:id` - Get evaluation by ID
- `GET /api/evaluations/user/:email` - Get evaluations by email
- `GET /api/evaluations` - Get all evaluations (with filters)
- `DELETE /api/evaluations/:id` - Delete evaluation

## 🧪 Testing with Postman

### 1. Get Countries

```
GET http://localhost:5000/api/countries
```

### 2. Get Specific Country

```
GET http://localhost:5000/api/countries/IE
```

### 3. Create Evaluation

```
POST http://localhost:5000/api/evaluations
Content-Type: multipart/form-data

Body (form-data):
- name: John Doe
- email: john@example.com
- countryCode: IE
- visaTypeId: critical-skills
- resume: [upload PDF file]
- employment_contract: [upload PDF file]
- qualifications: [upload PDF file]
```

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   ├── constants.js
│   │   └── countries.js
│   ├── models/           # Mongoose models
│   │   └── Evaluation.js
│   ├── services/         # Business logic
│   │   ├── document.service.js
│   │   ├── gemini.service.js
│   │   └── evaluation.service.js
│   ├── controllers/      # Request handlers
│   │   ├── countries.controller.js
│   │   └── evaluations.controller.js
│   ├── routes/           # API routes
│   │   ├── countries.routes.js
│   │   └── evaluations.routes.js
│   ├── middleware/       # Custom middleware
│   │   ├── upload.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   └── app.js           # Express app setup
├── uploads/             # File storage
├── .env                 # Environment variables
├── server.js           # Server entry point
└── package.json
```

## 🌍 Supported Countries

Currently configured:

- 🇮🇪 Ireland - Critical Skills Employment Permit
- 🇵🇱 Poland - Work Permit Type C
- 🇩🇪 Germany - EU Blue Card
- 🇺🇸 United States - O-1A, H-1B
- 🇨🇦 Canada - Express Entry
- 🇦🇺 Australia - Skilled Independent 189

## 🔧 Configuration

Edit `src/config/countries.js` to add more countries/visa types.

## 📝 Environment Variables

See `.env.example` for all available options.

## 🛠️ Development

```bash
npm run dev  # Runs with nodemon for auto-reload
```
