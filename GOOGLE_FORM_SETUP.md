# Google Form Backup Setup

This is a backup system for when EmailJS quota (200 emails/month) runs out.

## Step 1: Create Google Form

1. Go to https://forms.google.com
2. Click **+ Blank** to create new form
3. Add title: "Portfolio Contact Form - Backup"

## Step 2: Add Form Fields

Add these questions (in order):

1. **Your Name** (Short answer, Required)
2. **Your Email** (Short answer, Required)
3. **Subject** (Short answer)
4. **Message** (Paragraph, Required)

## Step 3: Link to Google Sheets (Optional but Recommended)

1. Click **Responses** tab
2. Click **Link to Sheets** (green icon)
3. Create new spreadsheet: "Portfolio Messages"
4. All submissions will be saved here

## Step 4: Get Form URL

1. Click **Send** button (top right)
2. Click **Link** icon (chain/link icon)
3. **Copy the URL** - it looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform
   ```

## Step 5: Get Entry IDs (Important!)

1. Open your form URL in new tab
2. Right-click on page → **View Page Source** (or press Ctrl+U)
3. Search for **"entry."** (Ctrl+F)
4. Find the entry IDs for each field, they look like:
   - Name: `entry.123456789`
   - Email: `entry.987654321`
   - Subject: `entry.555555555`
   - Message: `entry.777777777`

## Step 6: Update Your Code

Open `js/script.js` and update these lines:

```javascript
// Replace this line (around line 91):
const GOOGLE_FORM_URL = "YOUR_GOOGLE_FORM_URL_HERE";

// With your actual form URL:
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse";
```

**Note:** Change `/viewform` to `/formResponse` in the URL!

Then update the entry IDs (around line 130):

```javascript
const googleFormSubmitURL = `${GOOGLE_FORM_URL}?` + 
    `entry.123456789=${encodeURIComponent(name)}&` +      // Your Name entry ID
    `entry.987654321=${encodeURIComponent(email)}&` +     // Your Email entry ID
    `entry.555555555=${encodeURIComponent(subject)}&` +   // Subject entry ID
    `entry.777777777=${encodeURIComponent(message)}`;     // Message entry ID
```

## Step 7: Enable Email Notifications (Recommended)

1. Open your Google Sheets (Portfolio Messages)
2. Go to **Tools** → **Notification rules**
3. Select: **When** → "A user submits a form"
4. **Notify me at:** your email
5. Click **Save**

Now you'll get email notifications for every submission!

## How It Works

1. **Normal:** EmailJS sends email (you have 200/month)
2. **Quota exceeded:** Automatically switches to Google Form
3. **Visitor doesn't notice:** Still gets success message!
4. **You get notified:** Via Google Sheets email notification

## Testing

1. Save your changes
2. Refresh your portfolio
3. Test by filling the contact form
4. Check Google Sheets for submission

## Advantages

- ✅ Unlimited submissions (Google Forms is free)
- ✅ Automatic fallback when EmailJS quota runs out
- ✅ All data saved in Google Sheets
- ✅ Email notifications available
- ✅ No coding required after setup

## Need Help?

Video Tutorial: https://youtu.be/VjF4QKiMZWg (Google Forms setup)

---
**Your EmailJS quota resets on February 5, 2026**
