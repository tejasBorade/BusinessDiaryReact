from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from models import db, User
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'username', 'password', 'full_name', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 400
    
    # Validate role
    valid_roles = ['super_admin', 'admin', 'area_manager', 'store_owner', 'employee']
    if data['role'] not in valid_roles:
        return jsonify({'message': 'Invalid role'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        email=data['email'],
        username=data['username'],
        password=hashed_password,
        full_name=data['full_name'],
        phone=data.get('phone'),
        role=data['role'],
        is_active=True
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'Account is inactive'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + Config.JWT_ACCESS_TOKEN_EXPIRES
    }, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    token = None
    
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({'message': 'Invalid token format'}), 401
    
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        user = User.query.filter_by(id=data['user_id']).first()
        
        if not user or not user.is_active:
            return jsonify({'message': 'Invalid token'}), 401
        
        return jsonify({
            'valid': True,
            'user': user.to_dict()
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
