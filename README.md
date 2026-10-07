[![Live Demo](https://img.shields.io/badge/Live_Demo-career--craft-blue?style=for-the-badge)](https://career-craft-gamma-six.vercel.app) 

# CareerCraft

CareerCraft is a full-stack web application designed to help software engineers and job seekers prepare for interviews. It takes a target job description and your current resume, passes them to Google's Gemini AI, and generates a detailed, customized interview strategy and preparation report.

## Core Features

- AI-Powered Analysis: Uses Google Gemini to evaluate how well your resume matches a specific job description.
- Resume Parsing: Upload your PDF resume for instant contextual analysis.
- Custom Interview Plans: Generates personalized interview strategies, predicted technical questions, and skill gap analyses.
- Hybrid Authentication: Secure login system supporting both standard email/password (with OTP email verification) and Google OAuth via Firebase.
- History Tracking: Save and review your past generated reports and match scores in a personalized dashboard.

## Technical Architecture

The application follows a decoupled 4-layer MERN architecture:

- Frontend: React (Vite), React Router v6, custom SCSS (Glassmorphism design).
- State Management: React Context API and custom hooks for auth and AI generation.
- Backend: Node.js, Express, Multer (for PDF uploads), PDF-Parse.
- Database: MongoDB & Mongoose.
- Authentication: Custom JWT cookies, Nodemailer for OTPs (with MongoDB TTL indexing), and Firebase for Google OAuth bridging.
- AI Integration: @google/genai SDK.

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Google Gemini API Key
- Gmail App Password (for Nodemailer OTPs)
- Firebase Project Config (for Google OAuth)

## Installation & Setup

1. Clone the repository
   \\\ash
   git clone https://github.com/prateek-kumar-gupta/genai-resume-builder.git
   cd genai-resume-builder
   \\\

2. Setup the Backend
   \\\ash
   cd Backend
   npm install
   \\\
   
   Create a .env file in the Backend directory:
   \\\env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   \\\
   
   Start the backend server:
   \\\ash
   npm run dev
   \\\

3. Setup the Frontend
   Open a new terminal window:
   \\\ash
   cd Frontend
   npm install
   \\\

   Create a .env file in the Frontend directory:
   \\\env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   \\\
   
   Start the frontend server:
   \\\ash
   npm run dev
   \\\

## Usage

1. Register for an account (requires OTP email verification) or sign in with Google.
2. Navigate to the Home page and paste the Job Description of the role you want.
3. Upload your current Resume in PDF format.
4. Click "Generate Interview Report". The backend will process the PDF, query Gemini, and redirect you to a custom interview strategy dashboard.

