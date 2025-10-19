# CINEMORA - Backend for Authentication

This adds a minimal Node.js + Express backend to provide registration and login endpoints for the existing static frontend.

Files added:
- `server.js` - Express server and static file serving
- `routes/auth.js` - `/api/auth/register` and `/api/auth/login`
- `models/User.js` - Mongoose user model
- `package.json` - dependencies and scripts
- `.env.example` - example environment variables

Setup (Windows PowerShell):

1. Install Node.js (v18+ recommended).
2. In PowerShell, from the project root (`d:\cinemora`) run:

```powershell
npm install
# create a .env file or set env vars; example:
copy .env.example .env
# then edit .env to set JWT_SECRET and optionally MONGODB_URI
npm run start
```

By default the server will try to connect to `mongodb://127.0.0.1:27017/cinemora`. You can use a local MongoDB or a MongoDB Atlas connection string in `MONGODB_URI`.

Frontend integration notes:
- The HTML and CSS files were not changed. `create.js` was updated to POST to `/api/auth/register` and will still fallback to the previous localStorage behavior if the backend is not available. The login page continues to use localStorage by default; you can replace its client-side logic to call `/api/auth/login` if you want a full switch to server-auth.
