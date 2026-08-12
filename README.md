# ContAudit.eu Platform 🚀

A modern, full-stack web application designed for a premium accounting and auditing firm. This platform features a high-end, glassmorphic landing page designed to convert leads, coupled with a secure, custom-built Client Portal for seamless document exchange.

## 🌟 Features

### 1. Premium Landing Page
* **Modern Aesthetic**: Built with a sleek glassmorphism design system, smooth scroll animations, and a polished dark-navy/gold color palette.
* **Fully Responsive**: Flawless experience across desktop, tablet, and mobile devices.
* **Optimized Routing**: Powered by TanStack Start for lightning-fast, client-side navigation without page reloads.

### 2. Secure Client Portal
* **Authentication**: JWT-based login and registration system.
* **Role-Based Access**: 
  * **Clients**: Can log in to view their dashboard and securely download financial documents (balance sheets, audits).
  * **Administrators**: A dedicated Admin Dashboard to manage client accounts, answer requests, and upload sensitive documents.
* **Secure File Server**: Files are uploaded via `multer` and stored securely on the backend, strictly outside of the public web root. Files can only be downloaded by the authenticated client who owns them.

## 🛠️ Tech Stack

**Frontend:**
* [React](https://react.dev/) 19
* [TanStack Start](https://tanstack.com/start) / TanStack Router (File-based routing)
* [Tailwind CSS](https://tailwindcss.com/) (Styling)
* [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* [Prisma](https://www.prisma.io/) (ORM) with SQLite (easily upgradeable to PostgreSQL)
* [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt) (Security)
* [Multer](https://www.npmjs.com/package/multer) (File Uploads)

## 🚀 Getting Started

The project is split into two directories: `frontend` and `backend`. You will need to run both concurrently for the platform to work.

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Initialize the Prisma database
npx prisma db push

# Start the development server (runs on http://localhost:8080)
npm run dev
```

*Note: The first user to register via the frontend will automatically be assigned the `ADMIN` role by the backend.*

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server (runs on http://localhost:3000)
npm run dev
```

## 📄 License & Copyright

**Copyright (c) 2026 ContAudit.eu.**

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

Under this license, you are free to use, modify, and distribute this software, provided that:
1. **Attribution:** You must keep the original copyright notices intact and credit the original creator.
2. **Copyleft (ShareAlike):** Any modifications or derivative works must also be open-sourced under the exact same GPLv3 license. You cannot use this code to build closed-source proprietary software.
