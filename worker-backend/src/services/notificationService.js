export class NotificationService {
  constructor(env) {
    this.resendApiKey = env.RESEND_API_KEY;
    this.twilioAccountSid = env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = env.TWILIO_PHONE_NUMBER;
    this.fromEmail = env.FROM_EMAIL || 'noreply@businessdiary.com';
  }

  async sendEmail(to, subject, html) {
    if (!this.resendApiKey) {
      console.log('Email not sent: RESEND_API_KEY not configured');
      return { success: false, reason: 'not_configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [to],
          subject: subject,
          html: html
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Email send failed:', result);
        return { success: false, error: result };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(to, message) {
    if (!this.twilioAccountSid || !this.twilioAuthToken) {
      console.log('SMS not sent: Twilio credentials not configured');
      return { success: false, reason: 'not_configured' };
    }

    try {
      // Format phone number (ensure it has country code)
      const formattedPhone = to.startsWith('+') ? to : `+91${to}`;

      const auth = btoa(`${this.twilioAccountSid}:${this.twilioAuthToken}`);
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: this.twilioPhoneNumber,
            To: formattedPhone,
            Body: message
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        console.error('SMS send failed:', result);
        return { success: false, error: result };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  // Email templates
  getNewBookingEmailForOwner(booking, business, customer) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #059669; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Booking Received!</h1>
            </div>
            <div class="content">
              <p>Hello ${business.owner_name || 'Business Owner'},</p>
              <p>You have received a new booking for <strong>${business.name}</strong>.</p>
              
              <div class="booking-details">
                <h3>📅 Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Customer:</span> ${customer.name}
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span> ${customer.email}
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span> ${customer.phone}
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span> ${new Date(booking.booking_date).toLocaleDateString('en-IN')}
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span> ${booking.booking_time}
                </div>
                ${booking.service_type ? `<div class="detail-row"><span class="label">Service:</span> ${booking.service_type}</div>` : ''}
                ${booking.notes ? `<div class="detail-row"><span class="label">Notes:</span> ${booking.notes}</div>` : ''}
              </div>

              <p>Please log in to your dashboard to confirm or manage this booking.</p>
              
              <div style="text-align: center;">
                <a href="https://businessdiaryreact.pages.dev/bookings" class="button">View Booking</a>
              </div>
            </div>
            <div class="footer">
              <p>Business Directory | Your trusted business partner</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getBookingConfirmationEmailForCustomer(booking, business, customer) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #059669; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hello ${customer.name},</p>
              <p>Your booking with <strong>${business.name}</strong> has been confirmed!</p>
              
              <div class="booking-details">
                <h3>📅 Your Appointment</h3>
                <div class="detail-row">
                  <span class="label">Business:</span> ${business.name}
                </div>
                <div class="detail-row">
                  <span class="label">Address:</span> ${business.address}
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span> ${business.phone}
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span> ${new Date(booking.booking_date).toLocaleDateString('en-IN')}
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span> ${booking.booking_time}
                </div>
                ${booking.service_type ? `<div class="detail-row"><span class="label">Service:</span> ${booking.service_type}</div>` : ''}
              </div>

              <p>Please arrive 5 minutes before your scheduled time. If you need to cancel or reschedule, please contact the business directly.</p>
            </div>
            <div class="footer">
              <p>Business Directory | Your trusted business partner</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getBookingStatusEmailForCustomer(booking, business, customer, status, adminComments) {
    const statusConfig = {
      confirmed: { emoji: '✅', title: 'Booking Confirmed', color: '#10b981' },
      cancelled: { emoji: '❌', title: 'Booking Cancelled', color: '#ef4444' },
      completed: { emoji: '✅', title: 'Booking Completed', color: '#059669' }
    };

    const config = statusConfig[status] || statusConfig.confirmed;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${config.color}; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: ${config.color}; }
            .comments { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 3px solid #f59e0b; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.emoji} ${config.title}</h1>
            </div>
            <div class="content">
              <p>Hello ${customer.name},</p>
              <p>Your booking with <strong>${business.name}</strong> has been ${status}.</p>
              
              <div class="booking-details">
                <h3>📅 Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Business:</span> ${business.name}
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span> ${new Date(booking.booking_date).toLocaleDateString('en-IN')}
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span> ${booking.booking_time}
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span> <strong style="color: ${config.color}; text-transform: uppercase;">${status}</strong>
                </div>
              </div>

              ${adminComments ? `
                <div class="comments">
                  <strong>💬 Message from ${business.name}:</strong>
                  <p style="margin: 10px 0 0 0;">${adminComments}</p>
                </div>
              ` : ''}

              ${status === 'cancelled' ? '<p>If you have any questions, please contact the business directly.</p>' : ''}
              ${status === 'completed' ? '<p>Thank you for choosing us! We hope to see you again soon.</p>' : ''}
            </div>
            <div class="footer">
              <p>Business Directory | Your trusted business partner</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // SMS templates
  getNewBookingSMSForOwner(booking, business, customer) {
    return `New booking at ${business.name}!\nCustomer: ${customer.name}\nDate: ${new Date(booking.booking_date).toLocaleDateString('en-IN')}\nTime: ${booking.booking_time}\nPhone: ${customer.phone}\nManage: businessdiaryreact.pages.dev/bookings`;
  }

  getBookingConfirmationSMSForCustomer(booking, business, customer) {
    return `Your booking is confirmed!\n${business.name}\nDate: ${new Date(booking.booking_date).toLocaleDateString('en-IN')}\nTime: ${booking.booking_time}\nAddress: ${business.address}\nContact: ${business.phone}`;
  }

  getBookingStatusSMSForCustomer(booking, business, customer, status, adminComments) {
    const statusText = status.toUpperCase();
    let message = `Booking ${statusText}\n${business.name}\nDate: ${new Date(booking.booking_date).toLocaleDateString('en-IN')}\nTime: ${booking.booking_time}`;
    
    if (adminComments) {
      message += `\nNote: ${adminComments}`;
    }
    
    return message;
  }

  // Main notification methods
  async notifyNewBooking(booking, business, customer, ownerEmail, ownerPhone) {
    const notifications = [];

    // Email to business owner
    if (ownerEmail) {
      notifications.push(
        this.sendEmail(
          ownerEmail,
          `New Booking for ${business.name}`,
          this.getNewBookingEmailForOwner(booking, business, customer)
        )
      );
    }

    // SMS to business owner
    if (ownerPhone) {
      notifications.push(
        this.sendSMS(
          ownerPhone,
          this.getNewBookingSMSForOwner(booking, business, customer)
        )
      );
    }

    // Email confirmation to customer
    if (customer.email) {
      notifications.push(
        this.sendEmail(
          customer.email,
          `Booking Request Received - ${business.name}`,
          this.getBookingConfirmationEmailForCustomer(booking, business, customer)
        )
      );
    }

    // SMS to customer
    if (customer.phone) {
      notifications.push(
        this.sendSMS(
          customer.phone,
          `Booking request received at ${business.name}. We'll confirm soon. Date: ${new Date(booking.booking_date).toLocaleDateString('en-IN')}, Time: ${booking.booking_time}`
        )
      );
    }

    return Promise.all(notifications);
  }

  async notifyBookingStatusChange(booking, business, customer, status, adminComments) {
    const notifications = [];

    // Email to customer
    if (customer.email) {
      notifications.push(
        this.sendEmail(
          customer.email,
          `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${business.name}`,
          this.getBookingStatusEmailForCustomer(booking, business, customer, status, adminComments)
        )
      );
    }

    // SMS to customer
    if (customer.phone) {
      notifications.push(
        this.sendSMS(
          customer.phone,
          this.getBookingStatusSMSForCustomer(booking, business, customer, status, adminComments)
        )
      );
    }

    return Promise.all(notifications);
  }
}
