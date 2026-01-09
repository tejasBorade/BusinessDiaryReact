# Email and SMS Notification Setup Guide

## Overview
The booking system now sends automatic notifications via email and SMS to business owners and customers when bookings are created or status changes.

## Notification Features

### 1. **New Booking Created**
- **Email to Business Owner**: Beautiful HTML email with booking details
- **SMS to Business Owner**: Quick notification with customer info
- **Email to Customer**: Confirmation that booking request was received
- **SMS to Customer**: Quick confirmation message

### 2. **Booking Status Changed** (Confirmed/Cancelled/Completed)
- **Email to Customer**: Professional status update with admin comments
- **SMS to Customer**: Quick status notification

## Required Services

### Email Service: Resend (Recommended)
- **Website**: https://resend.com
- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Why Resend**: Simple API, excellent deliverability, free tier perfect for startups

### SMS Service: Twilio
- **Website**: https://www.twilio.com
- **Pricing**: Pay-as-you-go (~$0.0075/SMS to India)
- **Why Twilio**: Industry standard, reliable, global coverage

## Setup Instructions

### Step 1: Create Resend Account (Email)

1. Go to https://resend.com and sign up
2. Verify your email
3. Go to **API Keys** section
4. Click **Create API Key**
5. Name it "BusinessDirectory Production"
6. Copy the API key (starts with `re_...`)

**Important**: For production, you need to verify your domain:
- Go to **Domains** section
- Add your domain (e.g., businessdiary.com)
- Add the DNS records provided by Resend
- Once verified, use email like: `noreply@yourdomain.com`

For testing, you can use: `onboarding@resend.dev`

### Step 2: Create Twilio Account (SMS)

1. Go to https://www.twilio.com and sign up
2. Verify your phone number
3. Go to **Console Dashboard**
4. Copy your:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click to reveal)
5. Get a phone number:
   - Go to **Phone Numbers** → **Manage** → **Buy a number**
   - Select a number with SMS capability
   - For India: Get an Indian number or use Alphanumeric Sender ID

### Step 3: Configure Environment Variables

Run these commands in your `worker-backend` directory:

```powershell
# Set Resend API Key
wrangler secret put RESEND_API_KEY
# Paste your key when prompted (starts with re_...)

# Set From Email (your verified domain email)
wrangler secret put FROM_EMAIL
# Enter: noreply@yourdomain.com

# Set Twilio Account SID
wrangler secret put TWILIO_ACCOUNT_SID
# Paste your Account SID (starts with AC...)

# Set Twilio Auth Token
wrangler secret put TWILIO_AUTH_TOKEN
# Paste your Auth Token

# Set Twilio Phone Number (with country code)
wrangler secret put TWILIO_PHONE_NUMBER
# Enter: +1234567890 (your Twilio number)
```

### Step 4: Deploy Worker

```powershell
cd worker-backend
wrangler deploy
```

## Testing Notifications

### Test Email Only (Without Twilio)
If you only set up Resend, emails will be sent but SMS will be skipped silently.

### Test SMS Only (Without Resend)
If you only set up Twilio, SMS will be sent but emails will be skipped silently.

### Test Everything
1. Create a booking from the website
2. Check your email (customer and owner)
3. Check SMS on phones
4. Update booking status (confirm/cancel)
5. Check notifications again

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | No* | Resend API key for emails | `re_123abc...` |
| `FROM_EMAIL` | No | Sender email address | `noreply@yourdomain.com` |
| `TWILIO_ACCOUNT_SID` | No* | Twilio Account SID | `ACxxxxx...` |
| `TWILIO_AUTH_TOKEN` | No* | Twilio Auth Token | `your_token` |
| `TWILIO_PHONE_NUMBER` | No* | Twilio phone with country code | `+1234567890` |

*Optional, but at least one notification method (email or SMS) should be configured

## Cost Estimation

### Email (Resend Free Tier)
- **Included**: 3,000 emails/month, 100/day
- **Overage**: $1 per 1,000 emails
- **Typical Usage**: 
  - 100 bookings/month = 400 emails (2 to owner, 2 to customer)
  - Well within free tier!

### SMS (Twilio Pay-as-you-go)
- **India SMS**: ~₹0.60/SMS ($0.0075)
- **Typical Usage**:
  - 100 bookings/month = 300 SMS = ₹180/month (~$2.25)
  - Very affordable!

## Email Templates

The system includes 3 professional HTML email templates:

1. **New Booking** - Sent to owner and customer
2. **Booking Confirmed** - Sent to customer
3. **Booking Status Changed** - Sent to customer (cancelled/completed)

All templates are:
- ✅ Mobile responsive
- ✅ Professional design with emerald green theme
- ✅ Include all booking details
- ✅ Show admin comments when provided

## SMS Templates

Short, concise messages optimized for mobile:

1. **New Booking** - 160 characters
2. **Booking Confirmed** - With date, time, address
3. **Status Change** - With admin comments if provided

## Troubleshooting

### Notifications Not Sending

1. **Check Environment Variables**
```powershell
wrangler secret list
```

2. **Check Worker Logs**
```powershell
wrangler tail
```

3. **Verify Business Owner Has Email/Phone**
- Check database: `SELECT email, phone FROM users WHERE id = ?`
- Owner must have email/phone in users table

4. **Verify Customer Info in Booking**
- Customer email/phone must be provided when creating booking

### Email Issues

- **Not Receiving**: Check spam folder
- **Domain Not Verified**: Use `onboarding@resend.dev` for testing
- **Bouncing**: Verify recipient email is valid
- **Check Resend Dashboard**: https://resend.com/emails for delivery status

### SMS Issues

- **Not Receiving**: Check phone number format (+91 for India)
- **Wrong Country Code**: Update `notificationService.js` line 52
- **Twilio Trial**: Can only send to verified numbers
- **Check Twilio Logs**: https://console.twilio.com for delivery status

## Alternative Services

### Email Alternatives
- **SendGrid**: 100 emails/day free
- **Mailgun**: 5,000 emails/month free (first 3 months)
- **Amazon SES**: $0.10 per 1,000 emails

### SMS Alternatives
- **AWS SNS**: $0.00645/SMS to India
- **Vonage (Nexmo)**: Similar pricing to Twilio
- **MSG91**: India-focused, ₹0.15/SMS

## Production Checklist

- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] All 5 environment variables set
- [ ] Worker deployed
- [ ] Test booking created
- [ ] Email received by owner
- [ ] Email received by customer
- [ ] SMS received by owner
- [ ] SMS received by customer
- [ ] Status change notifications working
- [ ] Admin comments showing in notifications

## Support

For issues with:
- **Resend**: https://resend.com/docs
- **Twilio**: https://www.twilio.com/docs
- **Worker Deployment**: Run `wrangler tail` for logs

## Cost Optimization Tips

1. **Start with Email Only**: Free with Resend (3,000/month)
2. **SMS for Critical Updates**: Only send SMS for confirmations, not new bookings
3. **Batch Notifications**: Group multiple updates (future feature)
4. **Use WhatsApp**: Twilio WhatsApp Business (future integration)
