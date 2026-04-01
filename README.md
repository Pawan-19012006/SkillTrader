<div align="center">

#  SkillTrader

### Learn • Teach • Connect
![Status](https://img.shields.io/badge/Status-Active%20Development-red)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)
![Backend](https://img.shields.io/badge/Backend-Firebase-orange)
![Platform](https://img.shields.io/badge/Platform-Web-darkgreen)
![Build](https://img.shields.io/badge/Build-Vite-purple)

<img width="1709" height="896" alt="SkillTrader Preview" src="https://github.com/user-attachments/assets/cd7fa22d-47e5-4d57-8878-504565f5139f" />

</div>

---

## 🌟 Overview

**SkillTrader** is a modern, social-first learning ecosystem built to connect students, teachers, and skill-seekers in a seamless, interactive environment.

Designed with a premium dark-mode experience, the platform focuses on **community-driven learning**, enabling users to collaborate, communicate in real-time, and grow together—without the complexity of traditional SaaS tools.

---

## ✨ Why SkillTrader?

- 🤝 Social-first approach to learning  
- 💬 Real-time communication like modern messaging apps  
- 📅 Flexible group session bookings  
- 🌙 Clean, distraction-free dark UI  
- ⚡ Built for speed, scalability, and engagement  

---

## 🌟 Key Features

### 🤝 Social-First Learning
- **Student & Teacher Ecosystem**: Find people to learn from or teach others. Explore lessons, follow skilled users, and build your own learning circle.

- **Community Hub**: Join discussions, ask questions, or post what you want to learn. The community helps you connect and grow.

- **Follow System**: Follow other users to stay updated on what they’re learning, teaching, and sharing.
<img width="1710" height="993" alt="image" src="https://github.com/user-attachments/assets/63244640-18bd-4f10-ba41-82091ecda4db" />


### 💬 Real-Time Messaging
- **Chat Easily**: Talk to other users in a fast and smooth chat interface, similar to apps like WhatsApp or Telegram.
- **Quick Typing**: Press `Enter` to send messages instantly, or `Shift + Enter` to add a new line.
- **Clear Conversations**: See message times, who’s online, and message status for better communication.

<img width="1708" height="987" alt="image" src="https://github.com/user-attachments/assets/bfaaba73-8ea7-4d66-b002-f7ae07408205" />

### 📅 Session Bookings
- **Join Group Sessions**: Multiple users can join the same class or session—no limits to just 1-on-1.
- **Flexible Scheduling**: Teachers can set their own available dates and time slots.
- **Easy Booking**: Browse available sessions and book them in just a few clicks.

<img width="1710" height="720" alt="image" src="https://github.com/user-attachments/assets/7cf3f779-6701-4d22-8e42-a1846e561aa2" />
<img width="1710" height="993" alt="image" src="https://github.com/user-attachments/assets/9f27c51c-7cfc-4389-90ca-e68e3453f683" />

### 🔐 Secure & Protected
- **Safe Login**: Sign in securely using Google authentication.
- **Protected Access**: Only logged-in users can access private parts of the app.
- **Secure Data**: Sensitive information is kept safe and not exposed in the codebase.

## 🛠️ Tech Stack

| Layer        | Tools & Technologies                              |
|--------------|--------------------------------------------------|
| **Frontend** | React 18, Vite, TypeScript                       |
| **UI/Styling** | Tailwind CSS (dark-mode focused)               |
| **Animations** | Framer Motion                                  |
| **Icons**     | Lucide React                                    |
| **Backend**   | Firebase (Firestore, Authentication, Realtime)  |

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Pawan-19012006/SkillTrader.git
cd SkillTrader
```

### 2. Configure Environment Variables
You must set up your environment properties to connect to your own Firebase instance.
- Duplicate `.env.example` and rename it to `.env`.
- Fill in the values with your actual Firebase Project config.
```bash
cp .env.example .env
```

*Note: Your `.env` file is excluded via `.gitignore` and **must never be committed**.*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Architecture

```
src/
├── components/   # Reusable UI elements (Navbar, Button, Modals)
├── context/      # Master global states (AuthContext)
├── hooks/        # Custom React hooks (Counter animations, etc.)
├── lib/          # External linkages (Firebase config initialization)
├── pages/        # Main application views (Dashboard, Messages, Community, Profile)
└── utils/        # Helper methods (classnames merger, calendar exports)
```

## 🔒 Security Notes
If pushing this to GitHub:
- Do not remove `.env` or `.env.*` from `.gitignore`.
- Ensure no hardcoded strings exist inside `src/lib/firebase.ts`.
- The `.agent/` folder is explicitly ignored as it tracks the agentic history of the system's architecture over time.

---

*SkillTrader — Learn and teach together.*
