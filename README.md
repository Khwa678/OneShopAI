# 🚀 DocsAI (OneShop AI) - Multi-Model AI Document Workspace

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple.svg)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

**DocsAI (OneShop AI)** is an enterprise-grade, multi-model AI document intelligence platform. It provides a comprehensive suite of AI tools powered by top-tier LLMs—including **OpenAI GPT-4o**, **Anthropic Claude 3.5 Sonnet**, **Google Gemini 2.0**, **DeepSeek R1**, and **Meta Llama 3.3**—along with an integrated OCR engine, ATS resume matcher, contract agreement analyzer, AI content detector, content humanizer, document history manager, and dynamic theme engine.

---

## 🌟 Key Features

### 🛠️ AI Tools Suite
* **📄 AI Document Summarizer**: Extract concise executive summaries, bullet points, key takeaways, and structured insights from plain text or PDF documents using customizable LLM parameters.
* **👁️ Instant Optical Character Recognition (OCR) Engine**: High-accuracy, instant text extraction from scanned images (PNG, JPG, WebP) and PDFs with automatic text rendering upon upload or drag-and-drop, powered by Google Gemini 2.0 multi-modal vision and OCR engines.
* **🔓 Instant Guest Access**: Authentication is optional—all AI tools (OCR, Summarizer, ATS Matcher, Agreement Analyzer, Humanizer, Detector) are immediately accessible without requiring login.
* **🎯 ATS Resume Analyzer & Matcher**: Score resumes against target job descriptions. Get match percentages, identified missing keywords, formatting flags, and actionable recommendations.
* **⚖️ Legal & Contract Agreement Reviewer**: Perform detailed legal risk assessments on contracts, NDAs, and terms of service. Detect high-risk clauses, hidden obligations, and key terms.
* **🤖 AI Content & Plagiarism Detector**: Analyze text to estimate AI content percentages, sentence-level perplexity, and probability flags.
* **✨ AI Content Humanizer**: Rewrite AI-generated text to adopt natural human nuance, varied sentence structures, and fluid phrasing while preserving original key facts.
* **📁 Document Storage & History Manager**: Built-in document vault to save, search, filter, categorize, preview, export, and delete processed analyses.

### 🎨 Personalization & Experience
* **🎨 8 Dynamic Themes**: Switch seamlessly between *Light Studio*, *Midnight Dark*, *Nature Oasis*, *Cyberpunk Neon*, *Sunset Amber*, *Ocean Deep*, *Royal Violet*, and *Coffee Roast*.
* **🌐 Internationalization (i18n)**: Full multi-language user interface support for English (🇬🇧), Spanish (🇪🇸), French (🇫🇷), German (🇩🇪), and Hindi (🇮🇳).
* **📰 Built-in AI & Tech Blog**: Integrated blog reader with article categories, reading time estimates, tag filters, social sharing, and interactive engagement.
* **🔑 Authentication & Social Login**: JWT-based email/password authentication, user registration, user profile management, and Google OAuth 2.0 integration.

---

## 🤖 Supported AI Providers & Models

| Provider | Model Name | Primary Capability | API Key Variable |
| :--- | :--- | :--- | :--- |
| **OpenAI** | ChatGPT (GPT-4o) | Premier multimodal reasoning & speed | `OPENAI_API_KEY` |
| **Anthropic** | Claude 3.5 Sonnet | Deep analytical prose & legal context | `ANTHROPIC_API_KEY` |
| **Google AI** | Gemini 2.0 / 1.5 | High-speed multi-modal neural model | `GEMINI_API_KEY` / `GOOGLE_AI_STUDIO_API_KEY` |
| **DeepSeek** | DeepSeek R1 | High-efficiency mathematical & logical reasoning | `DEEPSEEK_API_KEY` |
| **Meta AI** | Llama 3.3 | Open-weights state-of-the-art LLM | `LLAMA_API_KEY` |
| **OCR.space** | OCR Engine | PDF & image text extraction | `OCR_API_KEY` |

---

## 🏗️ Tech Stack

### **Frontend**
* **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
* **Styling**: Modern Vanilla CSS with CSS Custom Properties (Variables) for theme engine
* **Icons**: [Lucide React](https://lucide.dev/)
* **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
* **Runtime**: [Node.js](https://nodejs.org/) (v18+)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: MongoDB (via Mongoose) with automatic JSON datastore fallback (`data_store.json`)
* **Security & Auth**: `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `cookie-parser`
* **File Processing**: `multer` (Upload handling), `pdf-parse` (PDF extraction)

---

## 📂 Project Structure

```
Docs-Playground/
├── backend/
│   ├── middleware/        # Security headers, JWT auth, and rate limiters
│   ├── routes/
│   │   ├── ai.js          # AI API endpoints (Summarizer, OCR, ATS, Legal, Humanizer, Detector)
│   │   ├── auth.js        # User signup, login, Google OAuth, profile management
│   │   ├── blogs.js       # Blog post listing, creation, and interaction routes
│   │   └── documents.js   # User document storage, retrieval, and delete operations
│   ├── utils/             # Helper utilities, file parser, and data store adapters
│   ├── data_store.json    # Local file-system fallback database
│   ├── db.js              # Database connection and dynamic schema adapters
│   ├── server.js          # Express app entry point & security policy middleware
│   ├── .env.example       # Template environment variable configuration
│   └── package.json       # Backend node dependencies and scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components, Modals, Headers, Footers
│   │   │   └── Tools/     # Dedicated AI Tool components (ATS, Summarizer, OCR, etc.)
│   │   ├── services/      # API communication modules
│   │   ├── utils/         # Translations (i18n), theme engine helper utilities
│   │   ├── App.jsx        # Core application container & route controller
│   │   ├── index.css      # Design system & CSS variable theme styling
│   │   └── main.jsx       # React application entry point
│   ├── index.html         # Document HTML template & meta attributes
│   ├── vite.config.js     # Vite configuration & proxy settings
│   └── package.json       # Frontend dependencies and build scripts
│
├── package.json           # Root workspace orchestrator package scripts
├── vercel.json            # Vercel deployment configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* *(Optional)* **MongoDB** (If using MongoDB instead of local JSON fallback)

### 📥 1. Clone the Repository
```bash
git clone https://github.com/Khwa678/OneShopAI.git
cd OneShopAI
```

### 📦 2. Install Dependencies
Install dependencies for both frontend and backend in one step from root:
```bash
npm run postinstall
```
*Or install manually inside each folder:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### ⚙️ 3. Environment Setup

Create a `.env` file inside the `backend/` directory (you can copy `.env.example`):

```bash
cd backend
cp .env.example .env
```

Fill in your configuration keys in `backend/.env`:

```env
# Server Configuration
PORT=5005
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000

# AI API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
LLAMA_API_KEY=your_llama_api_key
OCR_API_KEY=your_ocr_space_api_key

# (Optional) Database Configuration
MONGO_URI=mongodb://localhost:27017/docs_playground

# Google OAuth Credentials & reCAPTCHA Secret Key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RECAPTCHA_SECRET_KEY=6LeSbXMtAAAAAKSYZHza_JefYAILsyJDZRIvNeGy
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5005/api
VITE_RECAPTCHA_SITE_KEY=6LeSbXMtAAAAAAmCGW9rdayaFRAWiIWRwjfOgvRp
```

---

## 🏃 Running the Application

### Development Mode

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   The backend API server will run on `http://localhost:5005`.

2. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The Vite React frontend will launch on `http://localhost:5173`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/register` | Register a new user account | ❌ |
| **POST** | `/api/auth/login` | User login & JWT issuance | ❌ |
| **POST** | `/api/auth/google` | Google OAuth 2.0 login/signup | ❌ |
| **GET** | `/api/auth/me` | Fetch authenticated user details | ✅ |
| **POST** | `/api/ai/summarize` | Summarize document text / PDF | Optional |
| **POST** | `/api/ai/ocr` | Perform OCR text extraction | Optional |
| **POST** | `/api/ai/ats-check` | Analyze resume against job description | Optional |
| **POST** | `/api/ai/agreement-review` | Legal contract risk assessment | Optional |
| **POST** | `/api/ai/humanize` | Humanize AI text content | Optional |
| **POST** | `/api/ai/detect` | AI detection & pattern analysis | Optional |
| **GET** | `/api/documents` | List user saved document history | ✅ |
| **POST** | `/api/documents` | Save document to workspace | ✅ |
| **DELETE** | `/api/documents/:id` | Delete saved document | ✅ |
| **GET** | `/api/blogs` | Fetch tech blog articles | ❌ |

---

## 🛡️ Security & Privacy

* **🛡️ Multi-Tier Rate Limiting (`express-rate-limit`)**: Protects server resources and third-party AI keys (OpenAI, Gemini, Claude, DeepSeek) from quota exhaustion and bot spam:
  * **Global API Protection (`apiLimiter`)**: Max 100 requests per IP per 15 minutes across `/api`.
  * **Strict AI Key Protection (`aiLimiter`)**: Max 10 requests per IP per minute across `/api/ai/*`. Returns HTTP `429 Too Many Requests` with status headers if exceeded.
  * **Auth Protection (`authLimiter`)**: Max 15 requests per IP per 15 minutes on login/register endpoints.
* **🤖 Bot Protection**: Real Google reCAPTCHA v2 / v3 integration on login and authentication flows.
* **HTTP Security Headers**: Configured with `Helmet` middleware enforcing Content Security Policy (CSP), anti-clickjacking (`X-Frame-Options: DENY`), strict origin policies, and XSS protection.
* **Flexible Storage**: Data can be persisted to a secure MongoDB cluster or stored locally in an isolated fallback JSON store (`data_store.json`).
* **Transparent Key Encryption**: Built-in master key encryption support for storing sensitive third-party API credentials securely.

---

## ☁️ Deployment

### Deploying Frontend & Backend Monorepo

The workspace includes a root `vercel.json` configuration configured to route API traffic cleanly to your backend service (e.g., Render or AWS) and serve the SPA frontend via Vercel.

**Build Command**:
```bash
npm run build
```
This builds the production React assets into `frontend/dist` and moves static bundles into backend dist if running unified node hosting.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [Issues Page](https://github.com/Khwa678/OneShopAI/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p center align="center">
  Made with ❤️ by the <b>DocsAI / OneShop AI Team</b>
</p>
