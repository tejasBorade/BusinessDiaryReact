# Booking System Testing Guide

## Overview
The booking system has been successfully implemented with the following features:
- Public users can book appointments on business detail pages
- Business owners can view and manage their bookings
- Admins can view all bookings across all businesses
- Email and SMS notifications (console logs for now)

## Testing Steps

### 1. Test Public Booking (No Login Required)

1. Open browser: http://localhost:3000
2. Browse businesses on the home page
3. Click on any business card to view details
4. On the business detail page, click **"📅 Book Appointment"** button
5. Fill in the booking form:
   - Full Name (required)
   - Email (required)
   - Phone Number (10 digits, required)
   - Date (must be today or future date)
   - Time (select from dropdown)
   - Service Type (optional)
   - Message (optional)
6. Click **"Book Appointment"**
7. Check backend console for email/SMS notifications
8. You should see success message

### 2. Test Business Owner View

1. Login with store owner account:
   - Email: superadmin@businessdiary.com
   - Password: Admin@123
2. Click on **"📅 Bookings"** in the sidebar
3. You should see:
   - Statistics cards showing booking counts
   - Filter buttons (All, Pending, Confirmed, Completed, Cancelled)
   - Grid of booking cards with all details
4. Test actions:
   - For **Pending** bookings: Click "✓ Confirm" or "✕ Cancel"
   - For **Confirmed** bookings: Click "✓ Mark Complete"
5. Check backend console for email/SMS notifications sent to customer

### 3. Test Admin View

1. Login as admin (same account works)
2. Go to **"📅 Bookings"**
3. Admin sees ALL bookings from ALL businesses
4. Can manage any booking status
5. Can view statistics across all businesses

### 4. Backend API Endpoints

#### Create Booking (Public)
```bash
POST http://127.0.0.1:5000/api/bookings
Content-Type: application/json

{
  "business_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "9876543210",
  "booking_date": "2026-01-10",
  "booking_time": "14:00",
  "service_type": "Consultation",
  "message": "Please call before visit"
}
```

#### Get Bookings (Protected - Token Required)
```bash
GET http://127.0.0.1:5000/api/bookings
Authorization: Bearer <your-token>
```

#### Update Booking Status (Protected)
```bash
PUT http://127.0.0.1:5000/api/bookings/1
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Get Business Bookings (Public)
```bash
GET http://127.0.0.1:5000/api/bookings/business/1
```

### 5. Email/SMS Notifications

Currently implemented as console logs in backend. Check terminal output for:
- **New Booking**: Notification to business owner
- **Status Change**: Notification to customer
- Both email and SMS messages are logged

#### To Enable Real Email/SMS:

**For Email (using Gmail):**
1. Update `routes/bookings.py` - `send_email_notification` function
2. Configure SMTP settings:
```python
smtp_server = "smtp.gmail.com"
smtp_port = 587
sender_email = "your-email@gmail.com"
sender_password = "your-app-password"

server = smtplib.SMTP(smtp_server, smtp_port)
server.starttls()
server.login(sender_email, sender_password)
server.send_message(msg)
server.quit()
```
3. Install: `pip install flask-mail`

**For SMS (using Twilio):**
1. Sign up for Twilio account
2. Get Account SID and Auth Token
3. Update `routes/bookings.py` - `send_sms_notification` function:
```python
from twilio.rest import Client

account_sid = "your_account_sid"
auth_token = "your_auth_token"
twilio_phone = "your_twilio_phone"

client = Client(account_sid, auth_token)
message = client.messages.create(
    body=message,
    from_=twilio_phone,
    to=phone
)
```
4. Install: `pip install twilio`

## Features Implemented

✅ **Database**
- Booking model with all required fields
- Relationships with Business model
- Status workflow (pending → confirmed/cancelled → completed)

✅ **Backend API**
- Public booking creation endpoint
- Protected endpoints for viewing/managing bookings
- Role-based access (business owners see their bookings, admins see all)
- Email/SMS notification hooks (console logs)

✅ **Frontend Components**
- BookingForm modal with validation
- Date picker (future dates only)
- Time slot selector (9 AM - 6 PM)
- Phone number validation (10 digits)
- Service type and message fields

✅ **Booking Management Page**
- Statistics dashboard with counts
- Filter by status (all, pending, confirmed, cancelled, completed)
- Booking cards with all details
- Action buttons (Confirm, Cancel, Mark Complete)
- Role-based view (owners vs admins)

✅ **UI/UX**
- Gradient buttons and cards
- Smooth animations
- Responsive design
- Status badges with colors
- Empty state messages

## Database Schema

### Booking Table
- `id` - Primary key
- `business_id` - Foreign key to Business
- `customer_name` - String
- `customer_email` - String
- `customer_phone` - String
- `booking_date` - Date
- `booking_time` - String
- `service_type` - String (optional)
- `message` - Text (optional)
- `status` - Enum (pending, confirmed, cancelled, completed)
- `created_at` - DateTime
- `updated_at` - DateTime

## Status Workflow

1. **Pending** - Initial status when booking is created
2. **Confirmed** - Business owner approves the booking
3. **Cancelled** - Business owner or customer cancels
4. **Completed** - Service has been delivered

## Notes

- Bookings are sorted by creation date (newest first)
- Business owners can only manage their own business bookings
- Admins can manage all bookings
- Email/SMS notifications sent on: new booking, status change
- Public users can book without login/registration
- Booking form validates all required fields
- Date validation prevents past dates
- Phone validation requires 10 digits
- Time slots are pre-defined (9 AM - 6 PM, 30-min intervals)

## Next Steps (Optional Enhancements)

1. **Real Email/SMS Integration**
   - Configure SMTP for emails
   - Set up Twilio for SMS

2. **Calendar View**
   - Add calendar UI to see bookings by date
   - Month view with availability

3. **Booking Conflicts**
   - Check for double bookings
   - Show available time slots only

4. **Customer Portal**
   - Let customers view their booking history
   - Cancel/reschedule functionality

5. **Business Hours**
   - Configure business operating hours
   - Block time slots outside business hours

6. **Reminders**
   - Send booking reminders 24 hours before
   - Follow-up after completed bookings

7. **Export/Reports**
   - Export bookings to CSV/Excel
   - Generate monthly reports
   - Analytics dashboard

8. **Payment Integration**
   - Accept advance payments
   - Integrate Stripe/Razorpay

## Troubleshooting

**Backend not starting:**
```bash
cd backend
python app.py
```

**Frontend not starting:**
```bash
cd frontend
npm start
```

**Port 3000 already in use:**
```powershell
Get-Process -Name node | Stop-Process -Force
npm start
```

**Database errors:**
```bash
cd backend
python recreate_db_with_bookings.py
python populate_data.py
```

**API not responding:**
- Check if backend server is running on http://127.0.0.1:5000
- Check browser console for CORS errors
- Verify token in Authorization header

## Support

For any issues or questions:
1. Check backend console for error logs
2. Check browser console for frontend errors
3. Verify database has bookings table: `sqlite3 businessdiary.db ".tables"`
4. Test API endpoints using Postman or curl
