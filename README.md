# 📢 Notification Management System (Backend Only)

The **Notification Management System** is a backend application designed to manage and deliver notifications to users. It differentiates between **critical and non-critical** notifications, ensuring that messages are delivered based on the recipient's **availability** and the nature of the notification.

---

## 🌍 **Project Deployed Link (Render)**

🔗 https://notification-management-system.onrender.com

---

## 🚀 **Features**

### 🔹 **Admin Capabilities**

- Send notifications to **a single user** or **multiple users** simultaneously.
- Classify notifications as:
  - **Critical Notifications**: Delivered **immediately**, regardless of recipient availability.
  - **Non-Critical Notifications**: Delivered **only when** the recipient is available.

### 🔹 **User Capabilities**

- Send notifications to **one or multiple users**.
- Notifications adhere to the recipient's **availability**:
  - ✅ **Available Time** → Notification is delivered immediately.
  - ❌ **Unavailable Time** → Notification is **queued** and delivered once the recipient becomes available.

---

## 🛠 **Technologies Used**

| Technology         | Description           |
| ------------------ | --------------------- |
| **Backend**        | Node.js, Express.js   |
| **Database**       | MongoDB (Mongoose)    |
| **Authentication** | JSON Web Tokens (JWT) |
| **Scheduling**     | Node-Cron             |

---

## 📂 **Project Structure**

```
notification-management-system/
├── config/
│   └── database.js
├── controllers/
│   ├── userController.js
|
├── middleware/
│   └── auth.js
├── models/
│   ├── Notification.js
│   └── User.js
├── routes/
│   ├── userRoutes.js
│
├── utils/
│   └── notificationScheduler.js
|   |__ checkAvailiability.js
|
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## 👤 **API Endpoints**

### 🔑 **Authentication**

#### ✅ **Register a New User**

- **Endpoint:** `POST /users/signup`

- **Request Body:**
  ```json
  {
    "email": "novneet100@gmail.com",
    "password": "asd"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "newUser": {
      "email": "novneet100@gmail.com",
      "password": "$2b$10$pVl7TzekqadVPVFtMvMwzeqjFbKMK2tR9a1gY/GJZ2u4fagO6KELe",
      "availabilityTime": [],
      "isAdmin": false,
      "_id": "679a3cb4cf41fd47e7116679",
      "__v": 0
    }
  }
  ```

#### ✅ **User Login**

- **Endpoint:** `POST /users/login`

- **Request Body:**
  ```json
  {
    "email": "novneet300@gmail.com",
    "password": "asd"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 🔧 **Profile Management** (Protected Route - Requires Token)

#### ✅ **Update Profile**

- **Endpoint:** `PUT /users/update-profile`

- **Request Body:**
  ```json
  {
    "name": "Novneet",
    "mobileNumber": "+917007927209",
    "bio": "Aspiring Software Developer",
    "availabilityTime": ["16:00-17:00", "18:00-19:00"]
  }
  ```

---

### 📢 **Notification Management** (Protected Route - Requires Token)

#### ✅ **Create Notifications**

- **Endpoint:** `POST /users/create-notifications`

- **Request Body:**
  ```json
  {
    "sender": "679a06796086e22ce221856b",
    "recipients": ["679a01d395902e7308fd2aaf", "679a01cd95902e7308fd2aac"],
    "message": "Hello from Admin",
    "isCritical": true
  }
  ```

---

## ⏳ **Notification Scheduler**

- Runs every **30 seconds** to check **pending notifications**.
- **Critical Notifications** → Printed immediately on the console.
- **Non-Critical Notifications** → Delivered based on the recipient's availability.

---

## **I have already created an admin**

```json
{
  "email": "novneet300@gmail.com",
  "password": "asd"
}
```
