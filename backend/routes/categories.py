from flask import Blueprint, request, jsonify
from models import db, Category
from auth_middleware import token_required, role_required

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('', methods=['GET'])
def get_categories():
    try:
        include_subcategories = request.args.get('include_subcategories', 'false').lower() == 'true'
        categories = Category.query.filter_by(is_active=True).all()
        return jsonify({
            'categories': [category.to_dict(include_subcategories=include_subcategories) for category in categories]
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch categories', 'error': str(e)}), 500


@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        include_subcategories = request.args.get('include_subcategories', 'false').lower() == 'true'
        category = Category.query.get_or_404(category_id)
        category_dict = category.to_dict(include_subcategories=include_subcategories)
        category_dict['business_count'] = len(category.businesses)
        return jsonify({'category': category_dict}), 200
    except Exception as e:
        return jsonify({'message': 'Category not found', 'error': str(e)}), 404


@categories_bp.route('', methods=['POST'])
@token_required
@role_required('super_admin', 'admin')
def create_category(current_user):
    try:
        data = request.get_json()
        
        if 'name' not in data:
            return jsonify({'message': 'name is required'}), 400
        
        # Check if category already exists
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'message': 'Category already exists'}), 400
        
        new_category = Category(
            name=data['name'],
            description=data.get('description'),
            icon=data.get('icon'),
            is_active=True
        )
        
        db.session.add(new_category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': new_category.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create category', 'error': str(e)}), 500


@categories_bp.route('/<int:category_id>', methods=['PUT'])
@token_required
@role_required('super_admin', 'admin')
def update_category(current_user, category_id):
    try:
        category = Category.query.get_or_404(category_id)
        data = request.get_json()
        
        if 'name' in data and data['name'] != category.name:
            if Category.query.filter_by(name=data['name']).first():
                return jsonify({'message': 'Category name already exists'}), 400
            category.name = data['name']
        
        if 'description' in data:
            category.description = data['description']
        if 'icon' in data:
            category.icon = data['icon']
        if 'is_active' in data:
            category.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update category', 'error': str(e)}), 500


@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@token_required
@role_required('super_admin', 'admin')
def delete_category(current_user, category_id):
    try:
        category = Category.query.get_or_404(category_id)
        
        # Check if category has businesses
        if category.businesses:
            return jsonify({'message': 'Cannot delete category with existing businesses'}), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete category', 'error': str(e)}), 500
