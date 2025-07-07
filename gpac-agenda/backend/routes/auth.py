from flask import Blueprint, request, jsonify
import os, jwt, datetime, bcrypt
from ..supabase_util import sb_request   # função helper (ver passo 3)

auth_bp = Blueprint('auth', __name__)
JWT_SECRET = os.getenv('JWT_SECRET_KEY')

# ---------- Registro ----------
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    # Hash da senha
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Insere no Supabase
    resp = sb_request('POST', 'users', data={'email': email, 'password_hash': pw_hash})
    if isinstance(resp, tuple):
        return resp  # erro vindo do helper

    return jsonify({'message': 'User created'}), 201


# ---------- Login ----------
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    # Busca usuário
    resp = sb_request('GET', f'users?email=eq.{email}')
    user_list = resp.json()
    if not user_list:
        return jsonify({'error': 'Invalid credentials'}), 401

    user = user_list[0]
    if not bcrypt.checkpw(password.encode(), user['password_hash'].encode()):
        return jsonify({'error': 'Invalid credentials'}), 401

    payload = {
        'user_id': user['id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return jsonify({'token': token}), 200
