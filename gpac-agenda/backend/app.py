from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from datetime import datetime
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = 'https://bieztfazapkndadtrcad.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZXp0ZmF6YXBrbmRhZHRyY2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzc4NDAsImV4cCI6MjA2NTc1Mzg0MH0.kmI3kZAC910mvcCVzjcGVUSZqweewNh6ro4YOsI_Q9s'

def supabase_request(method, endpoint, data=None, params=None, token=None):
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    url = f'{SUPABASE_URL}/rest/v1/{endpoint}'
    
    response = requests.request(
        method=method,
        url=url,
        headers=headers,
        json=data,
        params=params
    )
    
    return response

@app.route('/api/events', methods=['GET'])
def get_events():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        response = supabase_request('GET', 'events', token=token)
        if response.status_code == 200:
            events = response.json()
            return jsonify(events), 200
        return jsonify({'error': 'Failed to fetch events'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        data = request.get_json()
        event_data = {
            'title': data['title'],
            'date_time': data['dateTime'],
            'location': data['location'],
            'description': data.get('description', ''),
            'participants': data.get('participants', ''),
            'reminders': data.get('reminders', ''),
            'user_id': data.get('user_id')  # This should come from the token in production
        }
        
        response = supabase_request('POST', 'events', data=event_data, token=token)
        if response.status_code in [201, 200]:
            return jsonify(response.json()), 201
        return jsonify({'error': 'Failed to create event'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        data = request.get_json()
        event_data = {
            'title': data['title'],
            'date_time': data['dateTime'],
            'location': data['location'],
            'description': data.get('description', ''),
            'participants': data.get('participants', ''),
            'reminders': data.get('reminders', '')
        }
        
        response = supabase_request(
            'PATCH',
            f'events?id=eq.{event_id}',
            data=event_data,
            token=token
        )
        
        if response.status_code == 204:
            return jsonify({'message': 'Event updated successfully'}), 200
        return jsonify({'error': 'Failed to update event'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        response = supabase_request(
            'DELETE',
            f'events?id=eq.{event_id}',
            token=token
        )
        
        if response.status_code == 204:
            return jsonify({'message': 'Event deleted successfully'}), 200
        return jsonify({'error': 'Failed to delete event'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# We don't need auth routes since Supabase handles authentication

if __name__ == '__main__':
    app.run(debug=True)
