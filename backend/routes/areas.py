from flask import Blueprint, request, jsonify
from models import db, Area, AreaManager
from auth_middleware import token_required, role_required

areas_bp = Blueprint('areas', __name__)

@areas_bp.route('', methods=['GET'])
def get_areas():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        city = request.args.get('city', '')
        
        query = Area.query.filter_by(is_active=True)
        
        if city:
            query = query.filter(Area.city.ilike(f'%{city}%'))
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'areas': [area.to_dict() for area in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch areas', 'error': str(e)}), 500


@areas_bp.route('/<int:area_id>', methods=['GET'])
def get_area(area_id):
    try:
        area = Area.query.get_or_404(area_id)
        area_dict = area.to_dict()
        area_dict['managers'] = [
            {'id': am.user_id, 'name': am.manager.full_name}
            for am in area.managers
        ]
        return jsonify({'area': area_dict}), 200
    except Exception as e:
        return jsonify({'message': 'Area not found', 'error': str(e)}), 404


@areas_bp.route('', methods=['POST'])
@token_required
@role_required('super_admin', 'admin')
def create_area(current_user):
    try:
        data = request.get_json()
        
        required_fields = ['name', 'city', 'state']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        new_area = Area(
            name=data['name'],
            city=data['city'],
            state=data['state'],
            pincode=data.get('pincode'),
            description=data.get('description'),
            is_active=True
        )
        
        db.session.add(new_area)
        db.session.commit()
        
        return jsonify({
            'message': 'Area created successfully',
            'area': new_area.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create area', 'error': str(e)}), 500


@areas_bp.route('/<int:area_id>', methods=['PUT'])
@token_required
@role_required('super_admin', 'admin')
def update_area(current_user, area_id):
    try:
        area = Area.query.get_or_404(area_id)
        data = request.get_json()
        
        if 'name' in data:
            area.name = data['name']
        if 'city' in data:
            area.city = data['city']
        if 'state' in data:
            area.state = data['state']
        if 'pincode' in data:
            area.pincode = data['pincode']
        if 'description' in data:
            area.description = data['description']
        if 'is_active' in data:
            area.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Area updated successfully',
            'area': area.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update area', 'error': str(e)}), 500


@areas_bp.route('/<int:area_id>', methods=['DELETE'])
@token_required
@role_required('super_admin', 'admin')
def delete_area(current_user, area_id):
    try:
        area = Area.query.get_or_404(area_id)
        
        db.session.delete(area)
        db.session.commit()
        
        return jsonify({'message': 'Area deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete area', 'error': str(e)}), 500


@areas_bp.route('/<int:area_id>/managers', methods=['POST'])
@token_required
@role_required('super_admin', 'admin')
def assign_manager(current_user, area_id):
    try:
        area = Area.query.get_or_404(area_id)
        data = request.get_json()
        
        if 'user_id' not in data:
            return jsonify({'message': 'user_id is required'}), 400
        
        # Check if already assigned
        existing = AreaManager.query.filter_by(
            user_id=data['user_id'],
            area_id=area_id
        ).first()
        
        if existing:
            return jsonify({'message': 'Manager already assigned to this area'}), 400
        
        assignment = AreaManager(
            user_id=data['user_id'],
            area_id=area_id
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Manager assigned successfully',
            'assignment': assignment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to assign manager', 'error': str(e)}), 500


@areas_bp.route('/<int:area_id>/managers/<int:user_id>', methods=['DELETE'])
@token_required
@role_required('super_admin', 'admin')
def remove_manager(current_user, area_id, user_id):
    try:
        assignment = AreaManager.query.filter_by(
            user_id=user_id,
            area_id=area_id
        ).first_or_404()
        
        db.session.delete(assignment)
        db.session.commit()
        
        return jsonify({'message': 'Manager removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to remove manager', 'error': str(e)}), 500
