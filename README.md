# 🚀 Extensio AI

## AI-Powered No-Code Chrome Extension Generator

Extensio AI is a modern web platform that enables users to generate fully structured Chrome Extensions using natural language prompts. The platform simplifies extension development by leveraging AI to automatically generate extension files, preview generated content, and provide downloadable extension packages without requiring manual coding.

---

# 📌 Project Overview

Developing Chrome extensions traditionally requires knowledge of JavaScript, HTML, CSS, Chrome APIs, and Manifest V3 architecture. Extensio AI bridges this gap by allowing users to describe their extension idea in plain English while the platform generates the extension structure automatically.

The platform is designed for:

* Students
* Beginners
* Developers
* Startup Teams
* Product Designers
* No-Code Users

Users can generate extension templates, preview generated files, download ZIP packages, and manage their generated projects through an interactive dashboard.

---

# ✨ Key Features

### 🤖 AI-Powered Extension Generation

Generate Chrome extensions using natural language prompts.

### 📂 Downloadable ZIP Packages

Download generated extension projects instantly.

### 🎨 Premium Dashboard UI

Modern SaaS-inspired responsive interface.

### 📑 Template Gallery

Pre-built extension templates for faster generation.

### 📜 Download History

Track previously generated projects using local storage.

### 📞 Contact & Feedback System

Built-in feedback and issue reporting interface.

### ⚙️ Settings Panel

Centralized settings and configuration interface.

### 🖥️ Live Preview Components

Interactive extension preview section.

### 📱 Responsive Design

Optimized experience across devices.

---

# 🏗️ System Architecture

User Prompt
↓
Frontend Dashboard (React)
↓
Backend API (Node.js + Express)
↓
Groq AI Model
↓
Structured Extension Files
↓
ZIP Packaging Service
↓
Downloadable Chrome Extension

---

# 🛠️ Technology Stack

## Frontend

* React.js
* React Router DOM
* Vite
* CSS3
* LocalStorage

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB

## AI Integration

* Groq API
* Prompt Engineering

## Validation & Security

* Zod Schema Validation
* Input Sanitization
* Manifest Validation

## File Processing

* Archiver
* UUID
* File System APIs

---

# 👩‍💻 Team Contributions

# 👩‍🎨 Shobha Ramesh

### Frontend Developer & UI/UX Designer

## 🎨 Complete UI/UX Design & Frontend Development

### Dashboard & UI Creation

* Designed and developed the complete frontend user interface
* Created modern SaaS-inspired dashboard experience
* Built responsive dashboard layouts and page structures
* Designed sidebar navigation with active route highlighting
* Created extension preview sections and dashboard widgets
* Implemented modern typography, spacing and visual hierarchy
* Added hover effects, animations and interactive UI elements
* Enhanced responsiveness across different screen sizes

### Frontend Functionalities

* Implemented extension generation workflow integration
* Developed template-based prompt autofill system
* Created Downloads History functionality using LocalStorage
* Built Contact & Feedback interface
* Developed Settings page and dashboard navigation
* Implemented React Router based page routing
* Connected frontend with backend API services
* Added generated extension preview rendering

### User Experience Improvements

* Improved navigation flow
* Enhanced dashboard usability
* Added responsive interactions
* Created reusable frontend components

### Frontend Files Created & Modified

#### Pages

* frontend/src/pages/Home.jsx
* frontend/src/pages/Contact.jsx
* frontend/src/pages/Downloads.jsx
* frontend/src/pages/Templates.jsx
* frontend/src/pages/Settings.jsx

#### Components

* frontend/src/components/Sidebar.jsx
* frontend/src/components/Navbar.jsx
* frontend/src/components/TemplateCard.jsx
* frontend/src/components/ProjectCard.jsx
* frontend/src/components/FilePreview.jsx

#### Core Frontend

* frontend/src/main.jsx
* frontend/src/index.css

---

# ⚙️ Rifa Nandoliya

### Backend Developer & AI Integration Engineer

## 🧠 Backend Architecture

### Backend Development

* Designed scalable backend architecture
* Implemented modular route-controller-service structure
* Built backend API workflows
* Developed centralized service handling

### AI Integration

* Integrated Groq AI API
* Implemented AI prompting system
* Added structured AI response generation
* Built Chrome Extension Manifest V3 generation workflow

### Validation & Security

* Added Zod schema validation
* Implemented filename sanitization
* Added duplicate filename detection
* Implemented response validation workflows

### File Generation Pipeline

* Developed dynamic file generation service
* Implemented ZIP creation workflow
* Built extension packaging pipeline
* Added UUID-based project generation

### Database & Infrastructure

* Configured MongoDB integration
* Developed project persistence architecture
* Implemented download route handling
* Managed backend environment configuration

### Backend Files Created & Modified

#### Core

* backend/src/server.ts
* backend/src/app.ts
* backend/src/config/db.ts

#### Controllers

* backend/src/controllers/generate.controller.ts

#### Routes

* backend/src/routes/generate.ts
* backend/src/routes/download.ts

#### Services

* backend/src/services/ai.service.ts
* backend/src/services/fileWriter.service.ts
* backend/src/services/zip.service.ts
* backend/src/services/project.service.ts

#### Models & Schemas

* backend/src/models/project.model.ts
* backend/src/schemas/extension.schema.ts

---

# 🚀 Installation & Setup

## Backend

```bash
cd backend
npm install
npm start
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Local Development URL

```bash
http://localhost:5173
```

---

# 📈 Future Enhancements

### Planned Features

1. User Authentication & Authorization
2. Monaco Code Editor Integration
3. Real-Time Extension Preview
4. Project Management Dashboard
5. Cloud-Based Project Storage
6. AI Model Selection Support
7. Extension Marketplace
8. Real-Time Code Editing
9. Team Collaboration Features
10. One-Click Chrome Store Packaging

---

# 🎯 Learning Outcomes

This project demonstrates practical implementation of:

* React.js Frontend Development
* UI/UX Design Principles
* API Integration
* AI Application Development
* Node.js Backend Development
* Full Stack Application Architecture
* Chrome Extension Generation Workflows
* State Management & Routing
* Local Storage Management
* Modern Dashboard Design

---

## 📄 License

This project was developed as part of an internship and educational learning initiative to explore AI-assisted software generation and modern full-stack application development.
