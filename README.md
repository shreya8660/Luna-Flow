# 🌙 LunaFlow — Aesthetic Period Tracker

A beautiful, premium feminine wellness platform built with the MERN stack.



## Live
https://luna-flow-2.onrender.com/

## 🎨 Color Palette
- Primary Pink: `#F472B6` / `#EC4899`
- Soft Rose: `#FBD5E5`
- Lavender: `#C4B5FD`
- Peach: `#FECACA`
- Background: `#FFF5F7`

## 🖋️ Font Suggestions
- Headings: `Playfair Display` (Google Fonts)
- Body: `Inter` or `DM Sans`
- Accent: `Cormorant Garamond`

---

## 📁 Folder Structure

```
lunaflow/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic
│   ├── middleware/     → JWT auth middleware
│   ├── models/         → Mongoose schemas
│   ├── routes/         → Express routes
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ → Reusable UI components
│   │   ├── context/    → React Context (Auth)
│   │   ├── pages/      → All pages
│   │   ├── utils/      → API helpers + cycle logic
│   │   └── hooks/      → Custom React hooks
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Git

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/lunaflow.git
cd lunaflow
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lunaflow
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## ☁️ Deployment

### Backend → Render
1. Push backend to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set environment variables (PORT, MONGO_URI, JWT_SECRET)
5. Build command: `npm install`
6. Start command: `node server.js`

### Frontend → Vercel
1. Push frontend to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import frontend folder
4. Set environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy!

### Database → MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create DB user + allow all IPs (0.0.0.0/0)
4. Copy connection string to your `.env`

---

## 🧠 Cycle Prediction Logic
- Default cycle = 28 days
- Ovulation = cycle start + (cycle length - 14)
- Fertile window = ovulation day ± 2 days
- Next period = last period start + cycle length

## 📦 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| State | Context API |

---

Made with 💗 for LunaFlow
