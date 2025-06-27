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

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://bieztfazapkndadtrcad.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZXp0ZmF6YXBrbmRhZHRyY2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzc4NDAsImV4cCI6MjA2NTc1Mzg0MH0.kmI3kZAC910mvcCVzjcGVUSZqweewNh6ro4YOsI_Q9s')

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

    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=data,
            params=params,
            timeout=10
        )
        response.raise_for_status()
        return response
    except requests.exceptions.HTTPError as http_err:
        return jsonify({'error': f'HTTP error occurred: {http_err}'}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': f'Error occurred: {err}'}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401

    response = supabase_request('GET', 'events', token=token)
    if isinstance(response, tuple):
        return response  # error response

    events = response.json()
    return jsonify(events), 200

@app.route('/api/events', methods=['POST'])
def create_event():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    event_data = {
        'sei_number': data.get('seiNumber'),
        'send_date': data.get('sendDate'),
        'subject': data.get('subject'),
        'requester': data.get('requester'),
        'location': data.get('location'),
        'focal_point': data.get('focalPoint'),
        'date': data.get('date'),
        'status': data.get('status'),
        'sei_request': data.get('seiRequest', ''),
        'user_id': data.get('user_id')  # This should come from the token in production
    }

    if not all([event_data['sei_number'], event_data['send_date'], event_data['subject'],
                event_data['requester'], event_data['location'], event_data['focal_point'],
                event_data['date'], event_data['status']]):
        return jsonify({'error': 'Missing required fields'}), 400

    response = supabase_request('POST', 'events', data=event_data, token=token)
    if isinstance(response, tuple):
        return response  # error response

    return jsonify(response.json()), 201

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    event_data = {
        'sei_number': data.get('seiNumber'),
        'send_date': data.get('sendDate'),
        'subject': data.get('subject'),
        'requester': data.get('requester'),
        'location': data.get('location'),
        'focal_point': data.get('focalPoint'),
        'date': data.get('date'),
        'status': data.get('status'),
        'sei_request': data.get('seiRequest', '')
    }

    if not all([event_data['sei_number'], event_data['send_date'], event_data['subject'],
                event_data['requester'], event_data['location'], event_data['focal_point'],
                event_data['date'], event_data['status']]):
        return jsonify({'error': 'Missing required fields'}), 400

    response = supabase_request(
        'PATCH',
        f'events?id=eq.{event_id}',
        data=event_data,
        token=token
    )

    if isinstance(response, tuple):
        return response  # error response

    if response.status_code == 204:
        return jsonify({'message': 'Event updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update event'}), response.status_code

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401

    response = supabase_request(
        'DELETE',
        f'events?id=eq.{event_id}',
        token=token
    )

    if isinstance(response, tuple):
        return response  # error response

    if response.status_code == 204:
        return jsonify({'message': 'Event deleted successfully'}), 200
    else:
        return jsonify({'error': 'Failed to delete event'}), response.status_code

# We don't need auth routes since Supabase handles authentication

if __name__ == '__main__':
    app.run(debug=True)
