# GPAC Agenda Backend

This is the backend service for the GPAC Agenda application, built with Flask and SQLAlchemy.

## Features

- User authentication (register, login)
- JWT-based authorization
- Event management (CRUD operations)
- SQLite database (configurable to use other databases)
- Environment variable configuration

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the variables in `.env` as needed
- Make sure to change the JWT_SECRET_KEY in production

4. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run the development server:
```bash
python app.py
```

The server will start at http://localhost:5000

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login and get JWT token

### Events
- GET /api/events - Get all events for authenticated user
- POST /api/events - Create a new event
- PUT /api/events/<event_id> - Update an existing event
- DELETE /api/events/<event_id> - Delete an event

## Request Headers

For protected routes, include the JWT token in the Authorization header:
```
Authorization: <jwt_token>
```

## Database Schema

### Users
- id (Primary Key)
- username (Unique)
- password (Hashed)
- email (Unique)
- created_at

### Events
- id (Primary Key)
- title
- date_time
- location
- description
- participants
- reminders
- created_at
- updated_at
- user_id (Foreign Key)

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes requiring valid tokens
- Input validation and sanitization
- CORS support for frontend integration
