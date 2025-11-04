#  Full-Stack Blogging Platform

A **full-stack blogging platform** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.  

---

## Overview  
It allows admins to create, manage, and organize blogs and comments efficiently while integrating **AI** and **cloud-based media management** for a seamless experience.  

---

##  Features  
-  **AI-Generated Content** — Generate blog posts automatically using the **Gemini API**.  
-  **ImageKit Integration** — Upload, optimize, and manage images seamlessly.  
-  **Secure Admin Authentication** — JWT-based authentication for admin access.  
-  **Smart Search Suggestions** — Suggests relevant blog titles as you type.  
-  **Blog and Comment Management** — Create, edit, delete, and manage posts and comments easily.  
-  **Responsive UI** — Clean and dynamic interface built with **React**.  

---

## 🛠️ Tech Stack  
**Frontend:** React, HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Token)  
**AI Integration:** Gemini API  
**Image Management:** ImageKit  

---

##  Getting Started  

### Prerequisites  
Make sure you have the following installed:  
- Node.js  
- MongoDB  
- npm or yarn  

---

### ⚙️ Installation  

```bash
# Clone the repository
git clone https://github.com/KRameshr/todaysbloging/

# Navigate to the project folder
cd today-blog

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install


Create a .env file in the root of your backend directory and include:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

 Run the App
# Run backend
cd server
npm start

# Run frontend
cd ../client
npm start


The app will be available at  🌐 http://localhost:5173

 
