# CureLink — Smart Healthcare & Appointment Platform (Starter)

This repository is a starter scaffold for CureLink — a full-stack healthcare web application.

What you get here:
- Backend: Node.js + Express + Mongoose with JWT authentication and appointment model
- Frontend: Vite + React + Tailwind CSS minimal app with auth pages
- Example env files and simple run instructions

This is a minimal, extendable scaffold to bootstrap development. Follow the sections below to run locally.

## Quick start

1. Open two terminals.
2. Backend:

```bash
cd "backend"
npm install
cp .env.example .env
# update .env with your MONGO_URI and JWT_SECRET
npm run dev
```

3. Frontend:

```bash
cd "frontend"
npm install
npm run dev
```

API runs on port 5000 by default; frontend on 5173.

## Next steps
- Add Cloudinary, OpenAI, payment and socket.io integration
- Add tests and CI
- Harden auth, validations, and rate limiting
