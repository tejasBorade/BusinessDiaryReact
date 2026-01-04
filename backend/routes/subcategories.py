from flask import Blueprint, request, jsonify
from models import db, SubCategory, Category
from auth_middleware import token_required, role_required

subcategories_bp = Blueprint('subcategories', __name__)

@subcategories_bp.route('', methods=['GET'])
def get_subcategories():
    """Get all subcategories or filter by category_id"""
    try:
        category_id = request.args.get('category_id', type=int)
        
        if category_id:
            subcategories = SubCategory.query.filter_by(category_id=category_id, is_active=True).all()
        else:
            subcategories = SubCategory.query.filter_by(is_active=True).all()
        
        return jsonify({
            'subcategories': [sc.to_dict() for sc in subcategories],
            'total': len(subcategories)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch subcategories', 'error': str(e)}), 500


@subcategories_bp.route('/<int:subcategory_id>', methods=['GET'])
def get_subcategory(subcategory_id):
    """Get a specific subcategory"""
    try:
        subcategory = SubCategory.query.get_or_404(subcategory_id)
        return jsonify({'subcategory': subcategory.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': 'Subcategory not found', 'error': str(e)}), 404


@subcategories_bp.route('', methods=['POST'])
@token_required
@role_required(['admin', 'super_admin'])
def create_subcategory(current_user):
    """Create a new subcategory"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('category_id'):
            return jsonify({'message': 'Name and category_id are required'}), 400
        
        # Check if category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        
        # Check if subcategory already exists in this category
        existing = SubCategory.query.filter_by(
            name=data['name'], 
            category_id=data['category_id']
        ).first()
        if existing:
            return jsonify({'message': 'Subcategory already exists in this category'}), 400
        
        # Create subcategory
        new_subcategory = SubCategory(
            name=data['name'],
            category_id=data['category_id'],
            description=data.get('description', ''),
            icon=data.get('icon', ''),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(new_subcategory)
        db.session.commit()
        
        return jsonify({
            'message': 'Subcategory created successfully',
            'subcategory': new_subcategory.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create subcategory', 'error': str(e)}), 500


@subcategories_bp.route('/<int:subcategory_id>', methods=['PUT'])
@token_required
@role_required(['admin', 'super_admin'])
def update_subcategory(current_user, subcategory_id):
    """Update a subcategory"""
    try:
        subcategory = SubCategory.query.get_or_404(subcategory_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            subcategory.name = data['name']
        if 'description' in data:
            subcategory.description = data['description']
        if 'icon' in data:
            subcategory.icon = data['icon']
        if 'is_active' in data:
            subcategory.is_active = data['is_active']
        if 'category_id' in data:
            # Verify category exists
            category = Category.query.get(data['category_id'])
            if not category:
                return jsonify({'message': 'Category not found'}), 404
            subcategory.category_id = data['category_id']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Subcategory updated successfully',
            'subcategory': subcategory.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update subcategory', 'error': str(e)}), 500


@subcategories_bp.route('/<int:subcategory_id>', methods=['DELETE'])
@token_required
@role_required(['admin', 'super_admin'])
def delete_subcategory(current_user, subcategory_id):
    """Delete a subcategory"""
    try:
        subcategory = SubCategory.query.get_or_404(subcategory_id)
        
        # Soft delete - mark as inactive
        subcategory.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Subcategory deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete subcategory', 'error': str(e)}), 500


@subcategories_bp.route('/category/<int:category_id>', methods=['GET'])
def get_category_subcategories(category_id):
    """Get all subcategories for a specific category"""
    try:
        category = Category.query.get_or_404(category_id)
        subcategories = SubCategory.query.filter_by(category_id=category_id, is_active=True).all()
        
        return jsonify({
            'category': category.to_dict(),
            'subcategories': [sc.to_dict() for sc in subcategories],
            'total': len(subcategories)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch subcategories', 'error': str(e)}), 500
