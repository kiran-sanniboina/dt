# 🎓 College Project Hub

> **A centralized academic platform to manage, evaluate, and showcase college engineering projects in one place.**  
> Developed for **Rajiv Gandhi University of Knowledge Technologies, Srikakulam** (`@rguktsklm.ac.in`).

---

## 📌 Project Overview

**College Project Hub** brings together student submissions, academic hierarchy management (Years $\rightarrow$ Sections $\rightarrow$ Teams $\rightarrow$ Team Leads), weighted faculty rubric evaluation, and interactive live project previews into a single unified web platform.

### ✨ Key Capabilities

- **Institutional Domain Restriction:** Authentication strictly enforced to `@rguktsklm.ac.in`.
- **Academic Hierarchy Management:** Faculty can create Academic Years, Sections, Teams, and designate Team Leads.
- **Automated Credential Engine:** Generates secure temporary passwords upon team creation and delivers credentials to the student lead's verified inbox via SMTP.
- **Strict One-Time Submission:** Teams can only submit once. Metadata (Year, Section, Team Name, Member list) is automatically inherited from the academic database.
- **Faculty Evaluation Suite:** Multi-criteria weighted rubric (100-point scale across 7 criteria) with live iFrame project preview and automated score card email delivery.
- **Public Showcase:** Searchable and filterable project gallery for students to explore peer innovations.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** with **Vite** & **TypeScript**
- **Tailwind CSS** (Custom university palette: deep navy, slate, emerald)
- **React Router v6** (Protected routes for Faculty & Team Leads)
- **Axios** (JWT Bearer token interceptors)
- **Lucide React** icons

### Backend (`/server`)
- **Node.js** with **Express** & **TypeScript**
- **MongoDB** with **Mongoose** (includes seamless in-memory fallback for zero-dependency local runs)
- **JWT** (`jsonwebtoken`) & **bcryptjs** (salt rounds = 10)
- **Nodemailer** (Real SMTP delivery for credentials & evaluation scorecards)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <your-repository-url>
cd college-project-hub

# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/college-project-hub
JWT_SECRET=your_secure_random_jwt_secret
COLLEGE_DOMAIN=@rguktsklm.ac.in

# Real SMTP Configuration (e.g. Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM="College Project Hub <noreply@rguktsklm.ac.in>"
```

### 4. Running the Application

From the root directory:

```bash
# Start backend server (Port 5000)
npm run dev:server

# Start frontend client (Port 5173)
npm run dev:client

# Or seed demo testing data
npm run seed
```

---

## 🔑 Demo Testing Accounts

| Portal | Email | Password | Role / Description |
| :--- | :--- | :--- | :--- |
| **Faculty Portal** | `teacher@rguktsklm.ac.in` | `teacher123` | Full access to Teacher Portal, Academic Management & Rubric Evaluation |
| **Team Lead (Ready to Upload)** | `suresh@rguktsklm.ac.in` | `password123` | **Team Gamma**: Test submitting fresh project |
| **Team Lead (Pending Review)** | `rahul@rguktsklm.ac.in` | `password123` | **Team Alpha**: Project uploaded, awaiting review |
| **Team Lead (Evaluated)** | `priya@rguktsklm.ac.in` | `password123` | **Team Beta**: Project evaluated (Score: 89/100) |

---

## 📄 License & Organization
Developed for academic purposes at **Rajiv Gandhi University of Knowledge Technologies, Srikakulam**  
Department of Computer Science and Engineering.
