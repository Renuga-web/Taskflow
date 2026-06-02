# TaskFlow 🗂️

A production-ready **Task Management REST API** built with Node.js, Express, MongoDB, Socket.io, and Cloudinary.



## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Backend API | `https://your-app.onrender.com` |
| Frontend | `https://your-app.vercel.app` |
| API Health | `GET /` → `{ "status": "ok" }` |

---

## ✨ Features

- 🔐 **JWT Authentication** — register, login, token expiry, bcrypt password hashing
- 👥 **Role-Based Access Control** — admin and user roles with two-level guards
- 📋 **Full Task Lifecycle** — create, assign, update status, sub-tasks, comments, activity log
- ⚡ **Real-time Updates** — Socket.io private rooms for instant task notifications
- 🖼️ **Image Uploads** — Multer + Cloudinary, files stream directly to cloud
- 🗑️ **Soft Delete & Recovery** — trash, restore, permanent delete
- 📊 **Dashboard Analytics** — parallel MongoDB queries via Promise.all
- ✅ **Input Validation** — Joi schemas on every endpoint
- 🏗️ **Clean Architecture** — modular MVC + service layer pattern

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Real-time | Socket.io |
| File uploads | Multer + Cloudinary |
| Validation | Joi |
| Frontend | React + Context API + Axios |

---

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # db, env, cloudinary, socket
│   ├── constants/        # roles, taskStatus, priority, activityTypes
│   ├── models/           # User, Task, Comment, ActivityLog
│   ├── middlewares/      # auth, role, validate, error, upload
│   ├── modules/
│   │   ├── auth/         # routes, controller, service, validation
│   │   ├── users/        # routes, controller, service, validation
│   │   ├── profile/      # routes, controller, service, validation
│   │   ├── tasks/        # routes, controller, service, validation
│   │   ├── comments/     # routes, controller, service, validation
│   │   ├── dashboard/    # routes
│   │   ├── trash/        # routes
│   │   └── uploads/      # controller
│   └── utils/            # generateToken, apiResponse, asyncHandler, activityLogger
└── server.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone the repo
```bash
git clone https://github.com/renuga/taskflow.git
cd taskflow/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your `.env` file
```bash
cp .env.example .env
```

Fill in the values:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the server
```bash
npm run dev
# Server running on http://localhost:5000
```

### 5. Test the health check
```
GET http://localhost:5000/
→ { "status": "ok", "message": "Task Manager API" }
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/auth/me` | Private | Get my profile |
| PUT | `/api/auth/change-password` | Private | Change password |

### Users (Admin only)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/:id` | Admin | Update user |
| PUT | `/api/users/:id/toggle-status` | Admin | Enable / disable account |
| DELETE | `/api/users/:id` | Admin | Delete user permanently |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Private | Get tasks (admin: all, user: assigned) |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/:id` | Private | Get task detail |
| PUT | `/api/tasks/:id` | Admin | Update task |
| PUT | `/api/tasks/:id/status` | Private | Update status |
| POST | `/api/tasks/:id/subtask` | Admin | Add sub-task |
| PUT | `/api/tasks/:id/subtask/:subId` | Private | Update sub-task |
| POST | `/api/tasks/:id/assets` | Admin | Upload image asset |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks/:taskId/comments` | Private | Get comments |
| POST | `/api/tasks/:taskId/comments` | Private | Add comment |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | Private | Delete comment |

### Trash (Admin only)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/trash` | Admin | List trashed tasks |
| PUT | `/api/trash/:id/trash` | Admin | Move to trash |
| PUT | `/api/trash/:id/restore` | Admin | Restore from trash |
| DELETE | `/api/trash/:id` | Admin | Permanent delete |
| DELETE | `/api/trash/empty` | Admin | Empty all trash |

### Dashboard & Profile
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard` | Private | Stats summary |
| GET | `/api/profile` | Private | Get profile |
| PUT | `/api/profile` | Private | Update profile |
| POST | `/api/profile/avatar` | Private | Upload avatar |

---

## 🔌 Real-time Events (Socket.io)

Connect your frontend after login:
```js
socket.connect();
socket.emit("joinRoom", userId);   // join private room
```

Listen for events:
```js
socket.on("taskAssigned", ({ message, taskId }) => { ... });
socket.on("taskUpdated",  ({ taskId, status })  => { ... });
socket.on("newComment",   ({ taskId, comment }) => { ... });
```

---

## 🏗️ Architecture

```
Request → Routes → Middleware → Controller → Service → Model → MongoDB
                                    ↓
                              apiResponse
                                    ↓
                               Response
```

**Why service layer?**
Controllers are 3–5 lines. All business logic lives in services.
Adding a feature only changes the service — no other layer is touched.

---

## 🚢 Deployment

### Backend → Render
1. Push to GitHub
2. Render → New Web Service → connect repo
3. Root dir: `server` | Build: `npm install` | Start: `node server.js`
4. Add all env vars in Render dashboard

### Frontend → Vercel
1. Push frontend to GitHub
2. Vercel → New Project → root dir: `client`
3. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`

---

## 🧪 Testing with Postman

1. Register: `POST /api/auth/register` → copy the `token`
2. Set header: `Authorization: Bearer <token>`
3. Create task: `POST /api/tasks`
4. Get dashboard: `GET /api/dashboard`

---

## 👩‍💻 Author

**Renuga**
Full Stack Developer — Chennai, India

- GitHub: [@Renuga-web](https://github.com/renuga-web)
- Email: renugabcse@gmail.com

---

## 📄 License

MIT — free to use and modify.
