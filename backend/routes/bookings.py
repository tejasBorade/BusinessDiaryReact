from flask import Blueprint, request, jsonify
from models import db, Booking, Business, User
from auth_middleware import token_required, role_required
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

bookings_bp = Blueprint('bookings', __name__)

def send_email_notification(to_email, subject, body):
    """Send email notification (configure SMTP settings)"""
    try:
        # Configure these with your email settings
        # For now, just print (you can configure Gmail SMTP or other service)
        print(f"EMAIL NOTIFICATION:")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print("="*50)
        # TODO: Implement actual email sending with SMTP
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_sms_notification(phone, message):
    """Send SMS notification (requires Twilio or similar service)"""
    try:
        # TODO: Implement SMS sending with Twilio or similar service
        print(f"SMS NOTIFICATION:")
        print(f"To: {phone}")
        print(f"Message: {message}")
        print("="*50)
        return True
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

@bookings_bp.route('', methods=['POST'])
def create_booking():
    """Create a new booking (public endpoint)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['business_id', 'customer_name', 'customer_email', 
                          'customer_phone', 'booking_date', 'booking_time']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Get business details
        business = Business.query.get_or_404(data['business_id'])
        
        # Parse booking date
        try:
            booking_date = datetime.strptime(data['booking_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Create booking
        new_booking = Booking(
            business_id=data['business_id'],
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data['customer_phone'],
            booking_date=booking_date,
            booking_time=data['booking_time'],
            service_type=data.get('service_type', ''),
            message=data.get('message', ''),
            status='pending'
        )
        
        db.session.add(new_booking)
        db.session.commit()
        
        # Send notifications to business owner
        owner = business.owner
        if owner:
            # Email notification
            email_subject = f"New Booking Request - {business.name}"
            email_body = f"""
            New booking request received:
            
            Customer: {data['customer_name']}
            Phone: {data['customer_phone']}
            Email: {data['customer_email']}
            Date: {data['booking_date']}
            Time: {data['booking_time']}
            Service: {data.get('service_type', 'N/A')}
            Message: {data.get('message', 'N/A')}
            
            Please log in to your dashboard to confirm or manage this booking.
            """
            send_email_notification(owner.email, email_subject, email_body)
            
            # SMS notification
            if owner.phone:
                sms_message = f"New booking at {business.name} from {data['customer_name']} on {data['booking_date']} at {data['booking_time']}"
                send_sms_notification(owner.phone, sms_message)
        
        # Send confirmation to customer
        customer_email_subject = f"Booking Confirmation - {business.name}"
        customer_email_body = f"""
        Dear {data['customer_name']},
        
        Your booking request has been received!
        
        Business: {business.name}
        Date: {data['booking_date']}
        Time: {data['booking_time']}
        Status: Pending Confirmation
        
        You will receive a confirmation once the business owner approves your booking.
        
        Thank you!
        """
        send_email_notification(data['customer_email'], customer_email_subject, customer_email_body)
        
        return jsonify({
            'message': 'Booking request submitted successfully',
            'booking': new_booking.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create booking', 'error': str(e)}), 500


@bookings_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    """Get bookings for current user (business owner sees their bookings, admin sees all)"""
    try:
        if current_user.role in ['super_admin', 'admin']:
            # Admin sees all bookings
            bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        elif current_user.role == 'store_owner':
            # Store owner sees only their business bookings
            business_ids = [b.id for b in current_user.owned_businesses]
            bookings = Booking.query.filter(Booking.business_id.in_(business_ids)).order_by(Booking.created_at.desc()).all()
        else:
            return jsonify({'message': 'Access denied'}), 403
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings],
            'total': len(bookings)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500


@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@token_required
def get_booking(current_user, booking_id):
    """Get a specific booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        # Check access permissions
        if current_user.role not in ['super_admin', 'admin']:
            if current_user.role == 'store_owner':
                business_ids = [b.id for b in current_user.owned_businesses]
                if booking.business_id not in business_ids:
                    return jsonify({'message': 'Access denied'}), 403
            else:
                return jsonify({'message': 'Access denied'}), 403
        
        return jsonify({'booking': booking.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch booking', 'error': str(e)}), 500


@bookings_bp.route('/<int:booking_id>', methods=['PUT'])
@token_required
def update_booking(current_user, booking_id):
    """Update booking status"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        # Check access permissions
        if current_user.role not in ['super_admin', 'admin']:
            if current_user.role == 'store_owner':
                business_ids = [b.id for b in current_user.owned_businesses]
                if booking.business_id not in business_ids:
                    return jsonify({'message': 'Access denied'}), 403
            else:
                return jsonify({'message': 'Access denied'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'status' in data:
            old_status = booking.status
            booking.status = data['status']
            
            # Send notification on status change
            if old_status != data['status']:
                status_message = {
                    'confirmed': 'confirmed',
                    'cancelled': 'cancelled',
                    'completed': 'completed'
                }.get(data['status'], 'updated')
                
                # Email to customer
                subject = f"Booking {status_message.title()} - {booking.business.name}"
                body = f"""
                Dear {booking.customer_name},
                
                Your booking has been {status_message}:
                
                Business: {booking.business.name}
                Date: {booking.booking_date}
                Time: {booking.booking_time}
                Status: {data['status'].upper()}
                
                Thank you!
                """
                send_email_notification(booking.customer_email, subject, body)
                
                # SMS to customer
                sms_msg = f"Your booking at {booking.business.name} on {booking.booking_date} has been {status_message}"
                send_sms_notification(booking.customer_phone, sms_msg)
        
        if 'service_type' in data:
            booking.service_type = data['service_type']
        if 'message' in data:
            booking.message = data['message']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Booking updated successfully',
            'booking': booking.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update booking', 'error': str(e)}), 500


@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@token_required
def delete_booking(current_user, booking_id):
    """Delete a booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        # Check access permissions
        if current_user.role not in ['super_admin', 'admin']:
            if current_user.role == 'store_owner':
                business_ids = [b.id for b in current_user.owned_businesses]
                if booking.business_id not in business_ids:
                    return jsonify({'message': 'Access denied'}), 403
            else:
                return jsonify({'message': 'Access denied'}), 403
        
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete booking', 'error': str(e)}), 500


@bookings_bp.route('/business/<int:business_id>', methods=['GET'])
def get_business_bookings(business_id):
    """Get all bookings for a specific business (public endpoint for checking availability)"""
    try:
        bookings = Booking.query.filter_by(business_id=business_id).order_by(Booking.booking_date, Booking.booking_time).all()
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings],
            'total': len(bookings)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500
