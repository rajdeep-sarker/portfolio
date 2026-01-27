# EmailJS Setup Instructions

Your contact form is now integrated with EmailJS! Follow these steps to complete the setup:

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a FREE account
3. Verify your email address

## Step 2: Add Email Service
1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Connect your email (info@rajdeep.engineer)
5. Copy the **Service ID**

## Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

**Subject:**
```
New Message from {{from_name}} - Portfolio Contact
```

**Body:**
```
You have received a new message from your portfolio website!

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save template and copy the **Template ID**

## Step 4: Get Public Key
1. Go to **Account** > **General**
2. Copy your **Public Key**

## Step 5: Update Your Code
Open `js/script.js` and replace these values:

```javascript
emailjs.init("YOUR_PUBLIC_KEY");  // Replace with your Public Key

emailjs.sendForm(
    'YOUR_SERVICE_ID',    // Replace with your Service ID
    'YOUR_TEMPLATE_ID',   // Replace with your Template ID
    contactForm
)
```

## Example:
```javascript
emailjs.init("xYz123ABc456");  // Your actual public key

emailjs.sendForm(
    'service_abc123',      // Your actual service ID
    'template_xyz789',     // Your actual template ID
    contactForm
)
```

## Step 6: Test
1. Open your portfolio in browser
2. Fill out the contact form
3. Click "Send Message"
4. Check your email (info@rajdeep.engineer)

## Troubleshooting
- Make sure all IDs are correct
- Check browser console for errors (F12)
- Verify email service is connected in EmailJS dashboard
- Free plan has 200 emails/month limit

## Need Help?
- EmailJS Documentation: https://www.emailjs.com/docs/
- Video Tutorial: https://youtu.be/dgcYOm8n8ME

---
**Note:** Keep your EmailJS credentials secure. The free plan is perfect for portfolio websites!
