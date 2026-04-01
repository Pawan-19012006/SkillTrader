# SkillTrader

<img width="1709" height="896" alt="image" src="https://github.com/user-attachments/assets/cd7fa22d-47e5-4d57-8878-504565f5139f" />


SkillTrader is a modern, social-first learning ecosystem designed to connect students, teachers, and skill-seekers. Built with a premium, robust dark-mode aesthetic and optimized for high user engagement, the platform breaks away from technical SaaS jargon to offer a highly intuitive peer-to-peer educational environment.

## 🌟 Key Features

### 🤝 Social-First Learning
- **Student & Teacher Ecosystem**: Discover lessons, follow top members, and build your own learning community.
- **Dynamic Community Hub**: Participate in open discussions or post specific structured learning requests.
- **Follow System**: A bidirectional following architecture allowing users to cultivate an academic network.
<img width="1710" height="993" alt="image" src="https://github.com/user-attachments/assets/63244640-18bd-4f10-ba41-82091ecda4db" />


### 💬 Real-Time Messaging
- **Modern Chat Interface**: A split-screen, highly responsive direct messaging UI natively inspired by Telegram and WhatsApp.
- **Smart Text-Area**: Seamless keyboard shortcuts (`Enter` to send, `Shift+Enter` for new lines).
- **In-Bubble Metadata**: Integrated timestamps, read-receipt placeholders, and dynamic online statuses ensure clear context.
<img width="1708" height="987" alt="image" src="https://github.com/user-attachments/assets/bfaaba73-8ea7-4d66-b002-f7ae07408205" />


### 📅 Session Bookings
- **1-to-Many Group Booking**: Break away from single 1:1 slot locking. Multiple learners can book the same session seamlessly.
- **Teacher Availability Controls**: Creators control exact dates and time slots for their classes.
- **Instant Booking Management**: Browse classes dynamically via the Explore index and lock in your syncs instantly.
<img width="1710" height="720" alt="image" src="https://github.com/user-attachments/assets/7cf3f779-6701-4d22-8e42-a1846e561aa2" />
<img width="1710" height="993" alt="image" src="https://github.com/user-attachments/assets/9f27c51c-7cfc-4389-90ca-e68e3453f683" />


### 🔐 Secure & Protected
- **Firebase Authentication**: Full Google Auth integration with stringent private-route protections.
- **Global Auth Guarding**: App-wide component wrappers ensuring non-authenticated users cannot bypass into private hubs.
- **Local Credentials**: Strict `.env` gating meaning no sensitive API configurations are tracked directly over VCS.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (Solid dark-mode framework, no arbitrary blurs)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend & Real-time**: Firebase (Firestore DB, Auth, Realtime listeners updates)

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
