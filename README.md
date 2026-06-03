# 📦 Productr - Instant Product Management System

Productr is a high-performance, modern full-stack product management system. It features a passwordless OTP authentication mechanism, dynamic dashboard list filters, responsive image compression previews, and a supercharged loading state optimized using the Stale-While-Revalidate (SWR) caching pattern.

🔗 **Live Application Link:** [https://productr-by-atul.vercel.app](https://productr-by-atul.vercel.app)  

---

## ✨ Features

- **⚡ Instant Loading (SWR Caching)**: Eliminates blocking full-screen loaders by loading products instantly from `sessionStorage` cache on the dashboard and form components, then revalidating data silently in the background.
- **🔐 Passwordless OTP Authentication**: Quick login flow using generated OTP verification with built-in keep-alive routines to prevent cold starts on Render server instances.
- **📁 Published & Unpublished Tabs**: Instantly switch and organize product statuses using local cache keys without repetitive backend requests.
- **🖼️ Canvas-Based Image Compression**: Compresses base64 images directly in the browser during upload, reducing payload sizes for database storage.
- **🎨 Glassmorphic Modern UI**: Implements a sleek dark blue design system, responsive layouts, sidebar navigations, and customized select dropdowns.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), Vite (v8), Vanilla CSS, React Router (v7), Axios
- **Backend**: Node.js, Express (v5), MongoDB, Mongoose (v8)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database cluster or local MongoDB instance

---

## 📂 Project Structure

```text
Productr/
├── client/          # React + Vite frontend source code
└── server/          # Node.js + Express backend source code
```

---

## 🔧 Installation & Configuration

### 1. Clone the Repository
```bash
git clone https://github.com/AtulRao22/Productr_Assignment_for_Internship.git
cd Productr_Assignment_for_Internship
```

### 2. Backend Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   ```
   *Replace `your_mongodb_connection_uri` with your MongoDB connection string (e.g., `mongodb+srv://...`).*

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run locally at [http://localhost:5000](http://localhost:5000).*

---

### 3. Frontend Setup (`/client`)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/client` directory and configure the backend API endpoint:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *Note: For production, replace the local URL with your hosted backend link (e.g., `https://productr-assignment-for-internship.onrender.com/api`).*

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run locally at [http://localhost:5173](http://localhost:5173).*

---

## 🌐 Production Deployment

### Frontend (Vercel)
The client project is configured for deployment on Vercel with a `vercel.json` rewrite file to support client-side React routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend (Render)
The server uses a keep-alive self-pinging routine to keep the free-tier Render server instance awake:
```javascript
setInterval(() => {
  axios.get("https://productr-assignment-for-internship.onrender.com")
    .then(() => console.log("🔄 Self-ping successful"))
    .catch(err => console.log("❌ Self-ping failed:", err.message));
}, 10 * 60 * 1000);
```
