from flask import Blueprint, request, jsonify
from models import db, Business, Category, Area, Review
from auth_middleware import token_required, role_required

businesses_bp = Blueprint('businesses', __name__)

@businesses_bp.route('', methods=['GET'])
def get_businesses():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        area_id = request.args.get('area_id', type=int)
        search = request.args.get('search', '')
        
        query = Business.query.filter_by(is_active=True)
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if area_id:
            query = query.filter_by(area_id=area_id)
        
        if search:
            query = query.filter(Business.name.ilike(f'%{search}%'))
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        businesses = []
        for business in pagination.items:
            business_dict = business.to_dict()
            business_dict['category'] = business.category.to_dict() if business.category else None
            business_dict['area'] = business.area.to_dict() if business.area else None
            businesses.append(business_dict)
        
        return jsonify({
            'businesses': businesses,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch businesses', 'error': str(e)}), 500


@businesses_bp.route('/my', methods=['GET'])
@token_required
def get_my_businesses(current_user):
    try:
        print(f"Fetching businesses for user: {current_user.id}, {current_user.email}")
        # Get businesses owned by the current user
        businesses = Business.query.filter_by(owner_id=current_user.id).all()
        print(f"Found {len(businesses)} businesses")
        
        result = []
        for business in businesses:
            business_dict = business.to_dict()
            business_dict['category'] = business.category.to_dict() if business.category else None
            business_dict['area'] = business.area.to_dict() if business.area else None
            result.append(business_dict)
        
        return jsonify({'businesses': result}), 200
    except Exception as e:
        print(f"Error in get_my_businesses: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Failed to fetch your businesses', 'error': str(e)}), 500


@businesses_bp.route('/<int:business_id>', methods=['GET'])
def get_business(business_id):
    try:
        business = Business.query.get_or_404(business_id)
        business_dict = business.to_dict()
        business_dict['category'] = business.category.to_dict() if business.category else None
        business_dict['area'] = business.area.to_dict() if business.area else None
        business_dict['owner'] = business.owner.to_dict() if business.owner else None
        business_dict['reviews'] = [review.to_dict() for review in business.reviews]
        
        return jsonify({'business': business_dict}), 200
    except Exception as e:
        return jsonify({'message': 'Business not found', 'error': str(e)}), 404


@businesses_bp.route('', methods=['POST'])
@token_required
@role_required('super_admin', 'admin', 'area_manager', 'store_owner')
def create_business(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category_id', 'area_id', 'address', 'phone']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Verify category and area exist
        category = Category.query.get(data['category_id'])
        area = Area.query.get(data['area_id'])
        
        if not category:
            return jsonify({'message': 'Invalid category'}), 400
        if not area:
            return jsonify({'message': 'Invalid area'}), 400
        
        # Set owner_id based on role
        owner_id = data.get('owner_id', current_user.id)
        if current_user.role == 'store_owner':
            owner_id = current_user.id  # Store owners can only create for themselves
        
        new_business = Business(
            name=data['name'],
            description=data.get('description'),
            category_id=data['category_id'],
            area_id=data['area_id'],
            owner_id=owner_id,
            address=data['address'],
            phone=data['phone'],
            email=data.get('email'),
            website=data.get('website'),
            opening_hours=data.get('opening_hours'),
            image_url=data.get('image_url'),
            gallery_images=data.get('gallery_images', []),
            is_verified=False,
            is_active=True
        )
        
        db.session.add(new_business)
        db.session.commit()
        
        return jsonify({
            'message': 'Business created successfully',
            'business': new_business.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create business', 'error': str(e)}), 500


@businesses_bp.route('/<int:business_id>', methods=['PUT'])
@token_required
def update_business(current_user, business_id):
    try:
        business = Business.query.get_or_404(business_id)
        
        # Check permissions
        if current_user.role not in ['super_admin', 'admin'] and business.owner_id != current_user.id:
            return jsonify({'message': 'Access denied'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            business.name = data['name']
        if 'description' in data:
            business.description = data['description']
        if 'address' in data:
            business.address = data['address']
        if 'phone' in data:
            business.phone = data['phone']
        if 'email' in data:
            business.email = data['email']
        if 'website' in data:
            business.website = data['website']
        if 'opening_hours' in data:
            business.opening_hours = data['opening_hours']
        if 'image_url' in data:
            business.image_url = data['image_url']
        if 'gallery_images' in data:
            business.gallery_images = data['gallery_images']
        
        # Only admins can change verification status
        if current_user.role in ['super_admin', 'admin']:
            if 'is_verified' in data:
                business.is_verified = data['is_verified']
            if 'is_active' in data:
                business.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Business updated successfully',
            'business': business.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update business', 'error': str(e)}), 500


@businesses_bp.route('/<int:business_id>', methods=['DELETE'])
@token_required
@role_required('super_admin', 'admin')
def delete_business(current_user, business_id):
    try:
        business = Business.query.get_or_404(business_id)
        
        db.session.delete(business)
        db.session.commit()
        
        return jsonify({'message': 'Business deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete business', 'error': str(e)}), 500


@businesses_bp.route('/<int:business_id>/reviews', methods=['POST'])
@token_required
def add_review(current_user, business_id):
    try:
        business = Business.query.get_or_404(business_id)
        data = request.get_json()
        
        if 'rating' not in data or not (1 <= data['rating'] <= 5):
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400
        
        # Check if user already reviewed
        existing_review = Review.query.filter_by(
            business_id=business_id,
            user_id=current_user.id
        ).first()
        
        if existing_review:
            return jsonify({'message': 'You have already reviewed this business'}), 400
        
        new_review = Review(
            business_id=business_id,
            user_id=current_user.id,
            rating=data['rating'],
            comment=data.get('comment')
        )
        
        db.session.add(new_review)
        
        # Update business rating
        all_reviews = business.reviews + [new_review]
        business.rating = sum(r.rating for r in all_reviews) / len(all_reviews)
        business.total_reviews = len(all_reviews)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Review added successfully',
            'review': new_review.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to add review', 'error': str(e)}), 500
