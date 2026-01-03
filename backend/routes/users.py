from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models import db, User
from auth_middleware import token_required, role_required

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
@token_required
@role_required('super_admin', 'admin')
def get_users(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        role = request.args.get('role', None)
        
        query = User.query
        
        if role:
            query = query.filter_by(role=role)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'users': [user.to_dict() for user in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    try:
        # Users can view their own profile, admins can view any
        if current_user.id != user_id and current_user.role not in ['super_admin', 'admin']:
            return jsonify({'message': 'Access denied'}), 403
        
        user = User.query.get_or_404(user_id)
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': 'User not found', 'error': str(e)}), 404


@users_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    try:
        # Users can update their own profile, admins can update any
        if current_user.id != user_id and current_user.role not in ['super_admin', 'admin']:
            return jsonify({'message': 'Access denied'}), 403
        
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update allowed fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'email' in data and data['email'] != user.email:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']
        
        # Only admins can change role and active status
        if current_user.role in ['super_admin', 'admin']:
            if 'role' in data:
                user.role = data['role']
            if 'is_active' in data:
                user.is_active = data['is_active']
        
        # Update password if provided
        if 'password' in data and data['password']:
            user.password = generate_password_hash(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update user', 'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
@role_required('super_admin', 'admin')
def delete_user(current_user, user_id):
    try:
        user = User.query.get_or_404(user_id)
        
        # Prevent deleting own account
        if user.id == current_user.id:
            return jsonify({'message': 'Cannot delete your own account'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete user', 'error': str(e)}), 500


@users_bp.route('/stats', methods=['GET'])
@token_required
@role_required('super_admin', 'admin')
def get_user_stats(current_user):
    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        
        role_counts = {}
        roles = ['super_admin', 'admin', 'area_manager', 'store_owner', 'employee']
        for role in roles:
            role_counts[role] = User.query.filter_by(role=role).count()
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'role_counts': role_counts
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch stats', 'error': str(e)}), 500
