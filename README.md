# Task Manager Backend 🚀

This repository contains the backend server for a simple Task Manager application. It provides a robust API to manage users, projects, and tasks, including features like user authentication, project assignment, and task tracking.

-----

## ✨ Features

  * **User Management:** Register, login, and manage user accounts.
  * **Authentication & Authorization:** Secure user access using JSON Web Tokens (JWT).
  * **Project Management:** Create, retrieve, update, and delete projects.
  * **Task Management:** Create, retrieve, update, and delete tasks within projects.
  * **Member Assignment:** Assign users to projects and tasks.
  * **Data Validation:** Robust input validation for all API endpoints.

-----

## 🛠️ Technologies Used

  * **Node.js:** JavaScript runtime environment.
  * **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
  * **MongoDB:** NoSQL database for flexible data storage.
  * **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
  * **bcryptjs:** Library for hashing passwords securely.
  * **jsonwebtoken (JWT):** For implementing token-based authentication.
  * **cors:** Node.js package for providing a Connect/Express middleware that can be used to enable CORS.
  * **dotenv:** Loads environment variables from a `.env` file.

-----

## 📦 Getting Started

### Prerequisites

  * **Node.js:** (v18 or higher recommended)
  * **npm** or **Yarn**
  * **MongoDB Atlas Account:** (Free tier is sufficient for development)
  * **Git**

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/codewith-swapnil/task-manager-backend.git
    cd task-manager-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install
    ```

### Environment Variables (.env)

Create a file named `.env` in the root directory of the backend project. This file will store your sensitive configuration details.

```dotenv
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=a_very_long_random_string_for_jwt_signing_key
```

  * **`PORT`**: The port number on which the server will run (e.g., `5000`).
  * **`MONGO_URI`**: Your MongoDB Atlas connection string. This can be found in your MongoDB Atlas cluster's "Connect your application" section. **Remember to replace `<username>` and `<password>` placeholders in the URI with your actual database user credentials.**
  * **`JWT_SECRET`**: A strong, randomly generated string used to sign and verify JWTs. You can generate one using `require('crypto').randomBytes(64).toString('hex')` in a Node.js console.

-----

## 🏃 Running Locally

1.  **Start the server:**
    ```bash
    npm start # or node server.js
    ```
    The server will start running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

-----

## 🌐 API Endpoints

The API is designed to be intuitive and RESTful. All endpoints are prefixed with `/api`.

### User Authentication

  * `POST /api/auth/register`: Register a new user.
  * `POST /api/auth/login`: Log in a user and receive a JWT.
  * `GET /api/auth/me`: Get current user details (requires authentication).

### Users

  * `GET /api/users`: Get all users (for member selection in frontend, usually requires admin/authenticated access).

### Projects

  * `GET /api/projects`: Get all projects.
  * `GET /api/projects/:id`: Get a project by ID.
  * `POST /api/projects`: Create a new project (requires authentication).
  * `PUT /api/projects/:id`: Update a project by ID (requires authentication and ownership/permissions).
  * `DELETE /api/projects/:id`: Delete a project by ID (requires authentication and ownership/permissions).

### Tasks

  * `GET /api/projects/:projectId/tasks`: Get all tasks for a specific project.
  * `GET /api/tasks/:id`: Get a task by ID.
  * `POST /api/projects/:projectId/tasks`: Create a new task for a project (requires authentication).
  * `PUT /api/tasks/:id`: Update a task by ID (requires authentication and ownership/permissions).
  * `DELETE /api/tasks/:id`: Delete a task by ID (requires authentication and ownership/permissions).

-----

## 🚀 Deployment

This backend server is designed for deployment on cloud platforms.

  * **Hosting:** [Render](https://render.com/) (recommended) or [Railway](https://railway.app/).
  * **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 tier).

### Deployment Setup (Environment Variables on Hosting Platforms)

When deploying your backend, you **must** set the environment variables directly on the hosting platform (e.g., Render's Environment settings). **Do NOT commit your `.env` file to Git.**

  * **`PORT`**: The hosting platform usually assigns this automatically, but if required, set it to `5000`.
  * **`MONGO_URI`**: The full MongoDB Atlas connection string with your actual credentials.
  * **`JWT_SECRET`**: The secret key for JWT signing.
  * **CORS `origin`**: If your frontend is hosted on a different domain (e.g., Vercel, Netlify), you'll need to configure CORS in your backend code to allow requests from your frontend's deployed URL. For example, if your frontend is at `https://your-frontend-app.vercel.app`, you'd configure CORS middleware like this:
    ```javascript
    const cors = require('cors');
    app.use(cors({
      origin: 'https://your-frontend-app.vercel.app', // Replace with your actual deployed frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    ```
  * **MongoDB Atlas IP Whitelisting**: Ensure you add the **outbound IP addresses of your Render service** (found in Render dashboard under your service's "Connect" section) to your MongoDB Atlas cluster's "Network Access" IP whitelist.

-----

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

-----

## 📄 License

[Optional: Add your license information here, e.g., MIT License]
