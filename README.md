# 🌐 TechKnots

**TechKnots** is a modern, interactive learning platform designed to empower learners through real-world projects, mentorship, and hands-on skill development.  
Built with **React**, **Vite**, **TailwindCSS**, **Firebase**, and **MongoDB**, it combines sleek UI with seamless functionality.

---

## 🚀 Features

- 🔐 **User Authentication** – Secure sign-up & login using Firebase Authentication.  
- 📚 **Courses Module** – Browse, manage, and explore tech-related courses.  
- ⚡ **Fast Frontend** – Built with Vite + React + TailwindCSS for optimal performance.  
- 🔗 **Backend API** – Node.js + Express server connected to MongoDB Atlas.  
- ☁️ **Cloud Database** – Persistent data storage with MongoDB.  
- 💻 **Responsive UI** – Works perfectly on desktop and mobile screens.  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | Firebase Auth |
| **Hosting (optional)** | Vercel / Render |

---

## 🧩 Folder Structure

techknots/
├── frontend/ # React + Vite frontend
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Courses.jsx
│ │ │ ├── Login.jsx
│ │ │ └── Signup.jsx
│ │ ├── firebaseClient.js
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Node.js backend
│ ├── index.js
│ ├── .env
│ └── package.json
│
├── .gitignore
├── LICENSE
└── README.md

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/y23asar/techknots.git
cd techknots

2️⃣ Setup Frontend
cd frontend
npm install
npm run dev

3️⃣ Setup Backend
cd ../server
npm install
node index.js

4️⃣ Environment Variables

Create a .env file in both frontend and server directories:

🔹 frontend/.env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techknots
VITE_API_BASE=http://localhost:4000

🔹 server/.env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
PORT=4000

🧠 Future Enhancements

Add admin dashboard for course management

Integrate payment gateway for premium courses

Implement AI-driven course recommendations

Add dark mode toggle

🧑‍💻 Developer

Abdul Yasar
Bachelor’s in Data Science | Passionate about EdTech & Full-Stack Development
📍 India
🔗 GitHub
