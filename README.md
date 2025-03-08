# Expense Tracker Application

A full-stack expense tracking application built with Django + MongoDB backend and React + Vite frontend.

## Tech Stack

### Backend

- Django
- Django REST Framework (DRF)
- Djongo (MongoDB support)
- JWT Authentication

### Frontend

- React.js
- Vite
- Axios
- CSS for styling

### Database

- MongoDB

## Project Structure

```
expense_tracker/
├── backend/           # Django backend
│   ├── api/          # REST API endpoints
│   ├── core/         # Core application logic
│   └── config/       # Django settings
└── frontend/         # React frontend
    ├── src/          # Source code
    ├── public/       # Static files
    └── components/   # React components
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Run migrations:

```bash
python manage.py migrate
```

4. Start the backend server:

```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Features

- User Authentication (Signup/Login)
- Expense Management (CRUD operations)
- Category-based expense tracking
- Date-based filtering
- Interactive and responsive UI
- RESTful API architecture
