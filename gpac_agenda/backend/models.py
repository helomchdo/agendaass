# Since we're using Supabase, we don't need SQLAlchemy models
# These are the Supabase table structures for reference:

"""
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
"""
