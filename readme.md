# Team Manager Backend

Backend service for the **Team Manager / TeamSync** platform built with modern technologies for real-time collaboration and team management.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)

---

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB (Mongoose)** - NoSQL database with ODM
- **Firebase Admin SDK** - Authentication & authorization
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Secure token-based authentication
- **Zod** - Schema validation
- **Nodemon** - Development auto-reload

---

## 📁 Project Structure

```txt
team-manager-backend/
├── src/
│   ├── config/               # Firebase & environment configurations
│   ├── controllers/          # Route controllers
│   ├── services/             # Business logic layer
│   ├── models/               # Mongoose schemas & models
│   ├── routes/               # Express route definitions
│   ├── middlewares/          # Auth, error handlers, guards
│   ├── utils/                # Helper functions & utilities
│   ├── app.ts                # Express application setup
│   ├── server.ts             # Server bootstrap & initialization
│   └── index.ts              # Application entry point
├── .env.sample               # Environment variables template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

---

## 🛠️ Setup Instructions

Follow these steps to set up and run the backend service locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/prashantkumar342/team-manager-backend.git
```

### 2️⃣ Navigate to Project Directory

```bash
cd team-manager-backend
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Firebase Admin SDK

1. Download your Firebase Admin SDK private key file (JSON format) from the [Firebase Console](https://console.firebase.google.com/)
   - Go to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
2. Place the downloaded JSON file in `team-manager-backend/src/config/`
3. Rename the file to `teamsync-firebase-service-account.json`

```bash
# File location should be:
src/config/teamsync-firebase-service-account.json
```

### 5️⃣ Setup Environment Variables

1. Review the `.env.sample` file to see all required environment variables
2. Create a new `.env` file in the root directory
3. Copy the contents from `.env.sample` and fill in your values

```bash
# Example .env structure
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
# Add other required variables from .env.sample
```

### 6️⃣ Run the Development Server

```bash
npm run dev
```

The server should now be running on `http://localhost:5000` (or your configured port).

---

## 🏗️ Build & Production

### Build TypeScript Code

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` directory.

### Run Production Server

```bash
npm run start
```

---

## 📝 Available Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm run start` | Run production server                    |
| `npm run lint`  | Run linter (if configured)               |
| `npm run test`  | Run tests (if configured)                |

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.sample` with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/team-manager

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email

# JWT (if applicable)
JWT_SECRET=your-secret-key

# Other configurations as needed
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Prashant Kumar**

- GitHub: [@prashantkumar342](https://github.com/prashantkumar342)

---

## 🐛 Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/prashantkumar342/team-manager-backend/issues) on GitHub.

---

## 📞 Support

For support, email your-email@example.com or join our community chat.

---

**Happy Coding! 🚀**
