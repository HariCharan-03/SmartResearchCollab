# Smart Research Collab & Idea Incubator

A full-stack web application designed to bridge the gap between academic vision and real-world incubation. Our decentralized platform helps users post project ideas, find collaborators, and secure mentorships seamlessly.

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js
- **Key Pages**: Login, Register, Dashboard, Idea Feed, Collaboration Page
- **Main Components**: Navbar, IdeaCard, Authentication Forms
- **UI & Styling**: Tailwind CSS, Liquid Glassmorphism design, Framer Motion

### Backend
- **Environment**: Node.js + Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Role-based access control (Admin, Project Creator, Student/Researcher, Mentor/Investor)

### Database
- **System**: MongoDB
- **Core Collections**:
  - `Users`: Stores user profiles, credentials, and roles.
  - `Ideas`: Contains research proposals and startup pitches.
  - `Collaborations`: Manages requests and team formations between users.
  - `MentorshipRequests`: Networking requests for guidance and funding.

## ✨ Main Features
- **Idea Posting**: Publish brilliant hypotheses and project concepts to the community.
- **Collaboration Network**: Browse ideas and send targeted requests to collaborate on projects.
- **Mentorship System**: Connect with experienced mentors or investors.
- **Role-Based Dashboard**: Custom views and privileges tailored to specific user roles.

## 🔗 Core API Endpoints

**Authentication**
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate a user and receive a JWT

**Ideas**
- `GET /api/ideas` - Fetch the public feed of research ideas
- `POST /api/ideas` - Publish a new research idea (Requires authentication)

## 📁 Project Folder Structure

### Frontend (`/client`)
Built with Vite + React. This folder contains all the user-facing interfaces and logic.
- **`/src/pages`**: Contains the full-screen views mapped to routes (e.g., `Landing.jsx`, `Dashboard.jsx`, `Login.jsx`).
- **`/src/components`**: Reusable UI blocks that make up the pages (e.g., `Navbar.jsx`, `IdeaCard.jsx`).
- **`/src/context`**: Global React state providers, such as `AuthContext.jsx` which manages whether the user is logged in.
- **`/src/api`**: Axios configuration (`axiosInstance.js`) to help the frontend easily talk to the backend, attaching the JWT to requests.
- **`/src/assets`**: Static files like images, SVGs, or custom fonts.

### Backend (`/server`)
Built with Node.js + Express. This acts as the brain and handles the database.
- **`/models`**: Mongoose schemas that define how your MongoDB data is structured (e.g., `User.js`, `Idea.js`).
- **`/routes`**: The entry points for API calls. These map URLs to specific controller functions (e.g., `/api/auth/login`).
- **`/controllers`**: The actual business logic. When a route is hit, the controller handles the math, database saving, and sends the response back to the frontend.
- **`/middleware`**: Security checkpoints. Functions here run *before* the controller (e.g., checking if the JWT token is valid before letting someone delete a project).
