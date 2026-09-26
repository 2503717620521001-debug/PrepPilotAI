# PrepPilot AI — Assess. Learn. Practice. Improve.

> **Tagline:** Assess. Learn. Practice. Improve.  
> **Mission:** A modern, intelligent, responsive, AI-powered placement preparation web application built for the GDG Prompt Wars hackathon.

---

## 🚀 Key Modules & Capabilities

1. **AI Diagnostic Assessment**
   - Covers Quantitative Aptitude, Logical Reasoning, Programming, Data Structures, Technical Knowledge (OS/DBMS/CN), and Communication.
   - Authoritative, server-side objective question scoring with detailed explanations.
   - Adaptive question generation via Google Gemini API with fallback to verified placement question banks.

2. **Intelligent Skill-Gap Analysis**
   - Multi-category SVG skill radar chart (Aptitude, Logical, Coding, Technical, Communication).
   - Identifies specific conceptual strengths, critical knowledge gaps, and repeated test mistakes.
   - Transparent, explainable AI: every recommended step includes empirical evidence from actual scores.

3. **Adaptive AI Learning Roadmap**
   - 7, 15, 30, and 60-day interactive preparation roadmaps.
   - Daily learning objectives, practice exercises, and milestone assessments tailored to available study hours.
   - Dynamic roadmap adjustment suggestions when new assessment scores are recorded.

4. **Intelligent Coding Practice**
   - Multi-language code editor supporting Python, Java, and C.
   - High-yield placement problems across Arrays, Stacks, Sorting, Linked Lists, Trees, and Dynamic Programming.
   - Sandboxed execution testing with runtime logging, memory stats, and AI hints.

5. **AI Mock Interview Simulator**
   - Multi-turn interactive HR, Technical, Behavioral, and Role-specific interview practice.
   - Dynamic panelist follow-ups and per-turn scoring for relevance, technical accuracy, and clarity.
   - Comprehensive final evaluation rubric with STAR framework coaching and practice recommendations.
   - Optional speech input using browser Web Speech API.

6. **AI Resume Analyzer**
   - Plain text / PDF resume extraction.
   - ATS match score calculation against target role descriptions.
   - Identifies verified skills present, flags missing industry keywords, and rewrites project bullet points using action verbs and quantifiable metrics.

7. **Company-Specific Placement Tracks**
   - Verified preparation blueprints for Google, Amazon, Qualcomm, TCS, Infosys, and more.
   - Hiring rounds timeline, estimated OA cutoffs, and frequently asked DSA patterns.

8. **AI Placement Career Explorer**
   - Detailed career roadmaps for Software Developer, VLSI Engineer, Embedded Systems, and Data Science.
   - Lists competencies, compensation benchmarks, and suggested portfolio capstone projects.

9. **Before-and-After Performance Report**
   - Signature capability comparing initial diagnostic baseline against subsequent evaluations.
   - Visual comparison overlay radar chart.
   - Downloadable, verified PDF progress report using jsPDF.

10. **Gamified Consistency & Streaks**
    - Daily study targets, consecutive study streak counter, and unlocked achievement badges.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion, canvas-confetti, jsPDF
- **Backend:** Node.js, Express, REST API endpoints, centralized error handling
- **Database & Auth:** Cloud Firestore, Firebase Authentication, secure ABAC Firestore rules
- **AI Engine:** Google Gemini API (`gemini-3.8-flash`) via `@google/genai` on server side

---

## 📦 Getting Started & Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- A Google Gemini API Key (configured in environment secrets or `.env`)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```bash
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

### 4. Running the Development Server
```bash
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### 5. Running Automated Tests
```bash
npm test
```

### 6. Building for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Architecture

- **Authoritative Scoring:** Assessment answer keys and grading logic remain strictly on the server.
- **Firebase Security Rules:** Hardened role-based and user-owned ABAC rules deployed to Cloud Firestore.
- **API Key Isolation:** `@google/genai` is only imported and executed on the backend server. The Gemini API key is never exposed to client browsers.
- **Code Execution Sandbox:** Submissions are validated against dangerous patterns (`child_process`, `os.system`, `eval`) before sandboxed execution.
