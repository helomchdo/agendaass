from functools import wraps
import jwt, os
from flask import request, jsonify
JWT_SECRET = os.getenv('JWT_SECRET_KEY')

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kw):
        header = request.headers.get('Authorization', '')
        if not header.startswith('Bearer '):
            return jsonify({'error': 'unauthorized'}), 401
        token = header.split()[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'invalid token'}), 401
        return f(*args, **kw)
    return wrapper
