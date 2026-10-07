# CareerCraft: Technical Documentation & Interview Guide

## 1. Project Overview
**CareerCraft** is an AI-powered Resume Builder and Interview Preparation platform. It allows users to upload their current resume (PDF) alongside a target Job Description (JD). The application utilizes the **Google Gemini AI** to analyze the documents, generate a tailored interview strategy, and dynamically craft an optimized resume.

*   **Tech Stack:** MERN (MongoDB, Express, React.js, Node.js)
*   **AI Engine:** `@google/genai` (Gemini API with Structured JSON output via Zod)
*   **Authentication:** Custom JWT + Nodemailer (OTP) + Firebase (Google OAuth)
*   **Styling:** Custom SCSS with modern Glassmorphism and Aurora UI principles

---

## 2. System Architecture (The 4 Layers)

The application strictly adheres to a decoupled 4-layer architecture, ensuring scalability and clean code separation.

### Layer 1: The UI / View Layer (React & SCSS)
*   **Design System:** Built using custom SCSS with a professional Blue/Indigo (`#3b82f6`) color palette. We utilized flexbox, CSS grid, and `backdrop-filter: blur()` for modern "Glassmorphism" split-screen auth layouts.
*   **State-Driven Views:** Instead of creating separate pages for every auth step, components like `Login.jsx` and `Register.jsx` use a `view` state (e.g., `"login" | "request-otp" | "verify-otp"`) to swap out forms seamlessly while maintaining the surrounding UI.
*   **Dynamic Loaders:** Custom spinning SVG logos (`LayersIcon`) replace generic spinners to reinforce brand identity during asynchronous operations.

### Layer 2: State Management & Hooks Layer
*   **Context API:** We used React's `createContext` to manage global state without the boilerplate of Redux.
*   **Custom Hooks:** 
    *   `useAuth()`: Encapsulates all user identity logic (`user`, `loading`, `handleLogin`, `handleRegister`, `handleGoogleLogin`, `handleLogout`). It automatically checks for an active session (`getMe`) on initial mount.
    *   `useInterview()`: Manages the complex state of uploading files, waiting for AI generation, and storing the resulting JSON report.

### Layer 3: The API / Network Layer (Axios)
*   **Centralized API Client:** Located in `auth.api.js` and `interview.api.js`, we use `axios.create()` with `withCredentials: true` globally configured. This ensures that our HTTP-only JWT cookies are automatically attached to every request sent to the backend.
*   **Endpoint Abstraction:** The UI never calls `axios.post` directly. It calls abstract functions like `requestRegistrationOtp(email)` which handles the network request and error parsing, returning clean data to the UI.

### Layer 4: Backend & Database Layer (Express & MongoDB)
*   **Routing & Controllers:** The Express backend routes (`auth.routes.js`) map directly to isolated controller functions (`auth.controller.js`). 
*   **Mongoose Models:** 
    *   `User`: Stores username, email, and securely hashed passwords (using `bcryptjs`).
    *   `Otp`: Stores temporary verification codes.
    *   `Report`: Stores the AI-generated JSON output mapped to a specific user.
*   **Services:** Heavy logic is abstracted into services (e.g., `email.service.js` for Nodemailer, `ai.service.js` for Gemini API interactions).

---

## 3. Deep Dive: The Hybrid Authentication System

The most complex part of the application is the Authentication system, which beautifully merges three different paradigms into one seamless experience.

### A. Custom JWT Authentication
Instead of relying on `localStorage` (which is vulnerable to XSS attacks), the backend issues a **JSON Web Token (JWT)** upon successful login. 
*   **Mechanism:** The token is signed using `jsonwebtoken` and injected into an **HTTP-only cookie** via `res.cookie("token", token)`. 
*   **Security:** The browser automatically sends this cookie with every subsequent API request. The backend middleware (`isLoggedIn`) intercepts the request, verifies the JWT signature, and attaches the `req.user` object before allowing access to protected routes.

### B. OTP Email Verification (Nodemailer + TTL Indexes)
We built a highly secure OTP (One-Time Password) system used for both **Registration** and **Forgot Password**.
1.  **Request:** User submits their email. Backend generates a 6-digit random code.
2.  **Storage:** The OTP is saved in the `Otp` MongoDB collection. **Crucially, we utilized a MongoDB TTL (Time-To-Live) index.** This index automatically deletes the OTP document from the database exactly 10 minutes (600 seconds) after creation, ensuring codes expire securely without needing cron jobs.
3.  **Delivery:** `email.service.js` utilizes `nodemailer` with a dedicated Gmail App Password to dispatch a styled HTML email containing the code.
4.  **Verification:** The user submits the code. The backend queries `OtpModel.findOne({ email, otp })`. If found, the action (creating user or resetting password) proceeds, and the OTP is manually deleted to prevent reuse.

### C. Google OAuth (The Firebase Bridge)
Integrating Google Login required a strategic approach to ensure it played nicely with our custom JWT system.
1.  **Client-Side Popup:** The frontend uses the Firebase JS SDK (`signInWithPopup`) to handle the complex OAuth redirects and Google account selection.
2.  **Data Extraction:** Once Firebase authenticates the user, the frontend extracts the `email`, `displayName`, and `uid`.
3.  **The Bridge:** Instead of relying on Firebase for session management, the frontend POSTs this data to our custom `/api/auth/google` endpoint.
4.  **Backend Resolution:** 
    *   If the email exists in our `User` DB, we immediately issue a JWT and log them in.
    *   If the email does *not* exist, we auto-register them. Since Google verified their identity, we generate a cryptographically secure, random 20-character string as their MongoDB password (which they will never need to know), save the user, and issue the JWT.

---

## 4. Challenges Faced & How We Resolved Them

When discussing the project in an interview, highlighting technical hurdles demonstrates problem-solving ability.

### Challenge 1: Managing Complex React State without Unmounting Components
**The Problem:** The Forgot Password and Registration flows required multiple steps (Enter details -> Request OTP -> Verify OTP). Creating a separate React Router page for every step felt clunky and caused the Glassmorphism background and brand banners to re-render, creating a jarring UX.
**The Solution:** We implemented a "State-Machine" UI pattern using a single `view` state variable (e.g., `const [view, setView] = useState("register")`). Conditional rendering (`{view === 'verify-otp' && <OTPForm />}`) allowed us to swap out only the form inputs while keeping the surrounding layout, banner, and state intact.

### Challenge 2: Bridging Stateless OAuth with Stateful JWTs
**The Problem:** Firebase Authentication is designed to manage its own sessions. However, our backend APIs relied on our custom HTTP-only JWT cookies to authorize actions (like generating AI reports). If a user logged in via Firebase, our backend wouldn't know who they were.
**The Solution:** We decoupled Firebase's identity verification from its session management. We used Firebase *strictly* as an Identity Provider (IdP) on the frontend. Once identity was confirmed, we built a "bridge" endpoint (`/api/auth/google`) that ingested the Firebase data, synced it to our MongoDB, and issued our own JWT cookie. This unified all users (Email/Pass and Google) under a single authorization pipeline.

### Challenge 3: Database Bloat and Stale OTPs
**The Problem:** Generating OTPs for users meant saving temporary codes to the database. If users requested OTPs but never verified them, the database would quickly bloat with stale, insecure codes.
**The Solution:** Instead of writing a background worker or chron job to clean up the database, we leveraged a native database feature: **MongoDB TTL (Time-To-Live) Indexes**. By setting `expires: 600` on the `createdAt` schema field, MongoDB's background thread automatically scrubs expired codes exactly 10 minutes after generation, ensuring optimal performance and strict security.

### Challenge 4: Passing Objects vs. Arguments in API Functions
**The Problem:** During the Registration UI overhaul, the frontend continuously received `400 Bad Request` errors from the backend claiming `email` and `password` were missing, even though the inputs were filled.
**The Solution:** Debugging the network payload revealed an argument destructuring mismatch. The React Hook was passing an object `{ username, email, password }` into the API service layer, but the service function `export async function register(username, email, password)` expected distinct arguments. The object was mapped entirely to `username`, leaving the rest `undefined`. We resolved this by aligning the function signatures and maintaining strict separation of concerns between Hooks (data collection) and API Services (data formatting).

---

## 5. Deployment Strategy & Environment Configuration

Deploying a decoupled MERN stack application requires careful orchestration of Cross-Origin Resource Sharing (CORS) and API base URLs.

### 5.1 Dynamic Environment URLs
During development, the frontend runs on \http://localhost:5173\ and the backend on \http://localhost:3000\. However, in production, these URLs change to random domain names provided by the hosting providers (e.g., Vercel and Render).

**The Solution:** We utilize environment variables to dynamically switch these URLs.
*   **Backend CORS:** In \pp.js\, we configure CORS to accept requests from \process.env.FRONTEND_URL || 'http://localhost:5173'\. This prevents unauthorized domains from querying our API, while allowing our Vercel frontend to connect seamlessly.
*   **Frontend Axios:** In \uth.api.js\ and \interview.api.js\, we set the Axios \aseURL\ to \import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'\. Vite automatically injects the production URL during the build process, ensuring all API calls are routed correctly.

### 5.2 The Deployment Pipeline
We chose a highly reliable, free-tier friendly deployment stack that separates the frontend and backend to allow for independent scaling.

1.  **Database (MongoDB Atlas):** Hosted in the cloud, requiring no local database management.
2.  **Backend (Render.com):** 
    *   We deployed the Node.js/Express server as a Render "Web Service".
    *   We specifically set the Root Directory to \Backend\ to ensure Render only installs dependencies for the server.
    *   All secrets (\MONGO_URI\, \JWT_SECRET\, \GOOGLE_GENAI_API_KEY\, \EMAIL_USER\, \EMAIL_PASS\) are securely injected via Render's dashboard.
3.  **Frontend (Vercel):**
    *   Vercel is optimized for Vite and React. We imported the GitHub repository and set the Root Directory to \Frontend\.
    *   We injected the Firebase OAuth keys alongside the crucial \VITE_BACKEND_URL\ (pointing to the live Render server).
4.  **The Final Handshake:** After Vercel generated the live frontend URL, we fed that URL back into Render's \FRONTEND_URL\ environment variable. This completed the CORS whitelist, allowing the two separated systems to securely exchange JWT cookies over the internet.
