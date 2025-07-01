# GPAC Agenda Backend

## Overview
Backend service for GPAC Agenda application, built with Flask and Supabase.

## Prerequisites
- Python 3.8+
- Node.js 14+
- Supabase account and project

## Environment Setup

1. Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
FLASK_ENV=production
FLASK_APP=app.py
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Development

Run the development server:
```bash
flask run
```

## Deployment on Render

### Prerequisites

1. Create a [Render](https://render.com) account
2. Fork or upload this repository to your GitHub account

### Deployment Steps

1. Ensure your repository structure is:
   ```
   gpac-agenda/
   ├── backend/
   │   ├── app.py
   │   ├── requirements.txt
   │   └── ...
   ├── render.yaml
   └── ...
   ```

2. In Render Dashboard:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository (Render will automatically detect render.yaml)

3. Configure Environment Variables in Render Dashboard:
   - Name: `gpac-agenda-api` (or your preferred name)
   - Add the following environment variables:
     ```
     FLASK_ENV=production
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     ```

4. Deploy:
   - Click "Create Web Service"
   - Render will automatically deploy your application
   - Monitor the deployment logs for any issues

### Verify Deployment

1. Once deployed, test the health check endpoint:
   ```
   https://your-app-name.onrender.com/api/health
   ```

2. Update your frontend API configuration with the new Render URL:
   ```javascript
   const API_BASE_URL = 'https://your-app-name.onrender.com/api';
   ```

### Health Checks

The application includes the following endpoints for monitoring:
- `/api/health` - Basic health check
- Error handling for 404 and 500 status codes

## Database

This application uses Supabase as the primary database. No other database connections are required.

### Supabase Tables

```sql
Table: events
Columns:
- id (uuid, primary key)
- sei_number (text)
- send_date (date)
- subject (text)
- requester (text)
- location (text)
- focal_point (text)
- date (date)
- status (text)
- sei_request (text)
- user_id (uuid, foreign key)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
```

## Security

- All routes require authentication via Supabase JWT
- CORS is configured for specific origins only
- Environment variables are required for sensitive data

## Maintenance

### Logging

The application uses Python's built-in logging module. Logs are formatted as:
```
%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

### Error Handling

- 404 errors return a JSON response
- 500 errors are logged and return a generic error message
- All database operations are wrapped in try-catch blocks

## Support

For any issues or questions, please contact the development team.
