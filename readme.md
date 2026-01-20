# Team Manager Backend

Backend service for the **Team Manager / TeamSync** platform.  
Built with **Node.js, Express, TypeScript, MongoDB**, Firebase Authentication, and Socket.IO.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB (Mongoose)**
- **Firebase Admin SDK** (Auth)
- **Socket.IO**
- **JWT**
- **Zod / Validation**
- **Nodemon**

---

## 📁 Project Structure

```txt
team-manager-backend/
├── src/
│   ├── config/               # Firebase & environment configs
│   ├── controllers/          # Route controllers
│   ├── services/             # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── middlewares/          # Auth, error handlers, guards
│   ├── utils/                # Helpers & utilities
│   ├── app.ts                # Express app
│   ├── server.ts             # Server bootstrap
│   └── index.ts              # Entry point
├── .env.sample               # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```
