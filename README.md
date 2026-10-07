# 🚀 GenAI Interview & Resume Strategist

A full-stack AI-powered application designed to help job seekers land their dream roles. By leveraging Google's Gemini AI, this application analyzes a target Job Description against your uploaded Resume and a quick Self-Description to generate a highly customized, actionable interview preparation report.

## ✨ Features

- **🧠 AI-Powered Analysis:** Uses Google Gemini (`gemini-3.8-flash`) to evaluate candidate fit.
- **📄 Smart Resume Parsing:** Upload your PDF or DOCX resume for instant contextual analysis.
- **🎯 Tailored Interview Plans:** Generates custom interview strategies, predicted questions, and skill gap analyses based on the exact job description.
- **🔒 Secure Authentication:** Built-in user authentication (session/cookies) to securely store and manage your past interview reports.
- **📱 Modern UI:** A beautiful, responsive dark-mode frontend built with React and SCSS.
- **📊 History Tracking:** Save and review your past generated reports and match scores.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router v6
- SCSS
- Context API

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- `@google/genai` (Gemini API)
- Multer & PDF-Parse (File handling)
- JSON Web Tokens (JWT)

## ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Google Gemini API Key

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prateek-kumar-gupta/genai-resume-builder.git
   cd genai-resume-builder
   ```

2. **Setup the Backend:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd Frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to `http://localhost:5173` in your browser.

## 📝 Usage
1. Create an account or log in.
2. Paste the Job Description of the role you are targeting.
3. Upload your Resume (PDF) OR provide a brief Self Description.
4. Click **Generate Interview Report** and let the AI build your customized strategy in seconds!
