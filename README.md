# ⚛️ GesTaxi SaaS - Admin Control Tower (React)

This is the Admin Panel (Control Tower) for the GesTaxi platform. Built with React (using Vite) and React Router, this is the central nervous system for the entire operation.

It allows a logged-in administrator to manage all aspects of the service, from approving drivers to dispatching pending rides.

---

### ✨ Core Ecosystem

This project is the frontend dashboard for a complete full-stack application.
* **[Backend API (Node.js)](https://github.com/Digao075/Taxi_Saas_Backend)**
* **[Employee App (React Native)](https://github.com/Digao075/Taxi_Saas_Mobile-App)**

---

### 🛠️ Tech Stack

* **React**
* **Vite** (for a modern, fast development environment)
* **React Router v6** (for all page navigation)
* **Axios** (for all communication with the backend API)
* **JavaScript (ES6+)**
* **CSS** (via inline styles and basic styling)

---

### 🚀 Key Features

* **Secure Admin Login:** Connects to a dedicated admin-only endpoint (`/auth/admin/login`).
* **Protected Routes:** All dashboard pages are protected. Unauthenticated users are redirected to the login page.
* **Session Management:** Uses `localStorage` to persist the admin's JWT auth token.
* **Central Dispatch "Control Tower":**
    * Fetches and displays only rides with `status: 'pending'`.
    * Allows the admin to **assign a driver** to a pending ride via an interactive modal.
    * Updates the ride status to `accepted` and removes it from the queue in real-time (without a page reload).
* **Driver Management:**
    * `GET` and display a list of all drivers.
    * `PUT` requests to approve (`active`), deactivate (`inactive`), or block drivers.
    * View driver details on a separate dynamic route (`/drivers/:id`).
    * Edit driver details directly from the details page.

---

### 🏁 Getting Started

To run this panel locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Digao075/taxi-saas-frontend.git](https://github.com/Digao075/taxi-saas-frontend.git)
    cd taxi-saas-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be running on `http://localhost:5173`.

4.  **Backend Prerequisite:**
    * This frontend is useless without the backend. Ensure the **[Backend API](https://github.com/Digao075/Taxi_Saas_Backend)** is running on `http://localhost:3333`.
    * Log in using your admin credentials (e.g., `admin@taxisaas.com` / `admin123`).
