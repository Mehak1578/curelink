# CureLink Backend (Starter)

This is a minimal Express + Mongoose backend used by the CureLink starter scaffold.

Features included:
- JWT auth (register/login)
- Appointment model and simple endpoints

Run locally:

```bash
cd backend
npm install
cp .env.example .env
# edit .env to provide MONGO_URI and JWT_SECRET
npm run dev
```

API endpoints (examples):
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- POST /api/appointments (Authorization: Bearer <token>) { doctor, date }
- GET /api/appointments/my (Authorization: Bearer <token>)

Important: this project uses MongoDB. Set `MONGO_URI` in your `.env` to point to your MongoDB instance. For local development you can run MongoDB via Docker (the repo includes a `docker-compose.yml` that starts a `mongo` service) or install MongoDB locally. Example local URI:

```
MONGO_URI=mongodb://localhost:27017/curelink
```

If you want tests to run against your real MongoDB, set `MONGO_URI` in the environment before running `npm test`. If not set, tests will use an in-memory MongoDB instance automatically.
