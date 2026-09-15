# LearnAI — Full-Stack AI Learning Platform

> **Intelligent Skill Gap Analysis & Adaptive Learning Platform**  
> An end-to-end full-stack SaaS platform that allows students and professionals to upload learning materials (PDFs), extract and understand concepts with AI, generate interactive MCQs, 3D Flashcards, and structured Summaries, evaluate competency, perform Competency Gap Analysis, and automatically generate personalized 4-week learning roadmaps.

---

## 🌟 Key Features

1. **PDF Ingestion & AI Processing**
   - Drag-and-drop PDF uploader with file size & type validation.
   - Text extraction using `PyMuPDF` (`fitz`) with smart paragraph chunking.
   - Automated identification of core topics with importance (`High`, `Medium`, `Low`) and difficulty ratings (`Beginner`, `Intermediate`, `Advanced`).

2. **Interactive MCQ / Quiz Engine**
   - Single-question interactive assessment runner with timer and question palette navigator.
   - Immediate grading calculating total score, percentages, and topic-level mastery.
   - Comprehensive answer sheets with detailed pedagogical explanations.

3. **3D Spaced Repetition Flashcards**
   - Interactive 3D flip card animations with smooth CSS perspective.
   - Next/Previous, Shuffle, Mark as Known, and Mark for Review tracking.
   - Spaced repetition progress counters and keyboard shortcut navigation.

4. **Intelligent Structured Summaries**
   - AI structured breakdown: Overview, Key Concepts, Important Definitions, and Key Takeaways.
   - 1-Click Copy to Clipboard and Download as Markdown (`.md`).
   - On-demand AI regeneration.

5. **Objective Competency Gap Analysis**
   - Dynamic competency score calculation calculated from actual question attempts aggregated by skill.
   - Strict status classification:
     - **80–100%**: `Strong`
     - **60–79%**: `Good`
     - **40–59%**: `Needs Improvement`
     - **0–39%**: `Weak`
   - Multi-dimensional Radar and Horizontal Bar visualizers (via Recharts).
   - AI diagnostic narrative highlighting strongest skills, primary gaps, and recommended learning focus.

6. **Personalized 4-Week Learning Roadmap**
   - Generates structured 4-week milestones prioritizing the user's weakest competency areas.
   - Milestone checklist with live progress calculation and automatic next-week unlocks.

7. **Progress Analytics Dashboard**
   - Historical score trajectory line chart, weekly study distribution, and skill breakdown charts.

8. **Authentication & Profile Management**
   - Secure JWT token authentication with bcrypt password hashing.
   - Student / Employee role selection.
   - Pre-seeded **1-Click Demo Account** (`demo@example.com` / `Demo@123`).
   - Profile image customization, stats summary, and password management.
   - Light and Dark appearance mode toggle.

9. **AI Provider Agnostic with Offline Fallback**
   - Supports Google Gemini API via `AI_API_KEY`.
   - Built-in intelligent deterministic fallback engine ensuring 100% full-stack functionality without requiring an external API key.

---

## 🏗️ Project Architecture

```
project-demo/
├── backend/
│   ├── app/
│   │   ├── auth/                # JWT handlers, bcrypt security, auth dependencies
│   │   ├── config.py            # Pydantic BaseSettings configuration
│   │   ├── database/            # SQLAlchemy database engine and session
│   │   ├── models/              # User, Document, Topic, Quiz, Flashcard, Competency, LearningPath
│   │   ├── routes/              # Auth, Documents, AI, Quizzes, Flashcards, Competency, Dashboard, Progress, Profile, Settings
│   │   ├── schemas/             # Pydantic schemas and standard API response envelopes
│   │   ├── services/            # PDF extraction, AI service, Competency & Quiz grading, Seeder
│   │   └── main.py              # FastAPI application entry point & CORS
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI library (Button, Card, Input, Modal, Badges, ProgressBar, etc.)
│   │   ├── context/             # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/               # LandingPage, Login, Signup, Dashboard, Upload, Materials, Summary, Quiz, Flashcards, Competency, LearningPath, Progress, Profile, Settings
│   │   ├── services/            # Axios instance with JWT interceptors
│   │   ├── App.jsx              # React Router route definitions
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives and 3D card CSS
│   ├── package.json             # Frontend dependencies
│   └── tailwind.config.js       # Custom SaaS Tailwind theme
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: 3.10, 3.11, 3.12, or 3.13

---

### Backend Setup

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   *To enable live Gemini API calls, set `AI_API_KEY=your_gemini_api_key` in `.env`.*
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The database `learnai.db` will automatically be created and pre-seeded with rich demo data on startup.*

- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Frontend Setup

1. Open a second terminal window:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Pre-Seeded Demo Account

You can use the **1-Click Demo** button on the Landing / Login page or sign in manually with:
- **Email**: `demo@example.com`
- **Password**: `Demo@123`

### Pre-Seeded Demo Data Included:
- **Documents**: *SQL Fundamentals.pdf*, *Python Fundamentals.pdf*, *Data Analysis.pdf*
- **Competency Baseline**:
  - Statistics: **85%** (*Strong*)
  - Python: **72%** (*Good*)
  - SQL: **42%** (*Needs Improvement*)
  - Data Analysis: **35%** (*Weak*)
- **Active 4-Week Learning Roadmap**:
  - Week 1 — SQL Basics (*Completed*)
  - Week 2 — Joins & Queries (*In Progress*)
  - Week 3 — Advanced SQL (*Locked*)
  - Week 4 — Data Analysis (*Locked*)
- **Quizzes & Attempts History**: Available in the Quizzes and Progress tabs.
- **3D Flashcards**: 10 pre-loaded interactive active recall cards.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```ini
DATABASE_URL=sqlite:///./learnai.db
JWT_SECRET=super_secret_jwt_key_change_in_production_987654321
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
AI_PROVIDER=gemini
AI_API_KEY=
UPLOAD_DIR=./uploads
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:8000/api
```

---

## 📄 License
This project is licensed under the MIT License.
