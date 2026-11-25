# CoursePulse — Feedback Application Admin Panel (MERN Stack)

A responsive, full-stack **Admin Panel for a Feedback Application** built with **MongoDB Atlas, Express.js, React.js, and Node.js**.

## Repository Structure

```text
feedback-admin-panel/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── feedbackController.js
│   ├── data/
│   │   └── sampleFeedback.js
│   ├── models/
│   │   └── Feedback.js
│   ├── routes/
│   │   └── feedbackRoutes.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── UpdateModal.jsx
│   │   ├── pages/
│   │   │   ├── AddFeedback.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Features Implemented

1. **Feedback Dashboard (`/`)**:
   - Displays **Course ID**, **Course Name**, **Course Duration**, **Overall Feedback Rating**, and feedback comments.
   - Real-time KPI summary cards (Total Feedback, Average Rating, Top Rated 4–5★, Needs Attention).
   - Search by Course ID, Course Name, Duration, or Comments, plus Rating filter.
   - Responsive dual layout: structured data table on desktop and stacked cards on mobile.
2. **Navbar & Routing**:
   - Sticky responsive navigation bar with **Dashboard** and **Add Feedback** tabs using `react-router-dom`.
3. **Add Feedback (`/add-feedback`)**:
   - Form fields for **Course Name**, **Feedback Comments**, and interactive 1–5 star **Feedback Rating** (plus optional Course ID and Course Duration overrides; auto-assigned if omitted).
   - Live dashboard preview card on desktop and client/server validation.
4. **Update & Delete Actions**:
   - **Update** button on each feedback entry opens a pre-filled modal to edit Course ID, Course Name, Course Duration, Feedback Comments, and Feedback Rating (`PUT /api/feedback/:id`).
   - **Delete** button opens a confirmation dialog to permanently remove feedback (`DELETE /api/feedback/:id`).
5. **MongoDB Atlas Integration**:
   - Node.js + Express backend connected to MongoDB Atlas via Mongoose (`MONGO_URI` in `backend/.env`).
   - Automatic one-time initial seeding on first connection to an empty database, plus `npm run seed` CLI support.

## Setup & Running Locally

### 1. Configure MongoDB Atlas Environment Variables

Update `backend/.env` with your free-tier **MongoDB Atlas** connection string (test/exam credentials only):

```env
PORT=5000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@<cluster-url>/feedback_admin?retryWrites=true&w=majority&appName=FeedbackAdmin
CLIENT_URL=http://localhost:5173
```

`frontend/.env` is pre-configured to point to the local backend API:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies & Start Backend

```bash
cd backend
npm install
npm start
```

*(Optional manual seed: `npm run seed` or `npm run seed -- --reset`)*

### 3. Install Dependencies & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## REST API Endpoints

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/api/health`        | API & MongoDB Atlas connection status     |
| GET    | `/api/feedback`      | List all feedback (`?search=&rating=`)    |
| GET    | `/api/feedback/:id`  | Get single feedback entry                 |
| POST   | `/api/feedback`      | Create new feedback entry                 |
| PUT    | `/api/feedback/:id`  | Update an existing feedback entry         |
| DELETE | `/api/feedback/:id`  | Delete a feedback entry                   |
| POST   | `/api/feedback/seed` | Load sample course feedback if empty      |
