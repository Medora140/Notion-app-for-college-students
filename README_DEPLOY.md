# Deployment Instructions

Your project is now configured for deployment on **Render** (Backend) and **Vercel** (Frontend).

## 1. Backend Deployment (Render)

- **Root Directory:** `career_tracker/server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `MONGO_URI`: Your MongoDB Atlas connection string.
  - `JWT_SECRET`: A random string for securing tokens.
  - `PORT`: 5000 (Render sets this automatically, but good to have).
  - `OLLAMA_URL`: (Optional) If you have an Ollama instance running.

## 2. Frontend Deployment (Vercel)

- **Root Directory:** `career_tracker/client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: `https://notion-app-for-college-students.onrender.com/api`

## Changes Made:
1. **CORS Update:** Added `https://notion-app-for-college-students.vercel.app` to the allowed origins in `server.js`.
2. **Uploads Directory:** Added logic to `server.js` to automatically create the `uploads/` folder if it doesn't exist (required for Render's ephemeral filesystem).
3. **API Service:** Verified `client/src/services/api.js` uses the correct production URL.
4. **Render Config:** Added a `render.yaml` file to the root for easier one-click deployments.

## Notes on AI (Ollama)
The current AI implementation uses a local Ollama instance (`http://localhost:11434`). This will **not** work on Render's free tier as it requires a local running service. You may need to swap this with an external API (like Hugging Face or OpenAI) for production use.
