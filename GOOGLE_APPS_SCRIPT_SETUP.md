# Google Apps Script Setup Guide - SECURE VERSION

## Step 1: Create a Google Apps Script

1. Go to https://script.google.com/
2. Click "New Project"
3. Delete any existing code in the Code.gs file
4. Copy and paste the entire content from `google-apps-script.js` file in this project
5. Save the project with a name like "AABS Training Registration Handler"

## Step 2: Set Up Secure Configuration (IMPORTANT!)

**Instead of having sensitive data visible in your code, use Google Apps Script's Properties Service:**

1. In Google Apps Script, find the `setupSecureConfiguration` function
2. Click "Run" next to `setupSecureConfiguration` 
3. Authorize the script when prompted
4. Check the execution log - you should see "✅ Secure configuration saved!"
5. **IMPORTANT**: After running once, you can optionally remove the hardcoded values from the `setupSecureConfiguration` function for extra security

## Step 3: Deploy as Web App

1. In Google Apps Script, click "Deploy" > "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following:
   - Description: "AABS Training Registration API"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (important for your Next.js app to access it)
4. Click "Deploy"
5. Review permissions and click "Authorize access"
6. Copy the Web App URL (it will look like: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec)

## Step 4: Update Environment Variables

1. In your project, open `.env.local`
2. Replace the placeholder URL with your actual Google Apps Script Web App URL:
   ```
   GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

## Step 5: Test the Integration

1. Start your Next.js development server: `npm run dev`
2. Fill out the registration form on your website
3. Submit the form
4. Check:
   - Your Google Sheet should have a new row with the registration data
   - You should receive an admin notification email
   - The user should receive a confirmation email

## 🔒 Security Features Implemented

### What's Now Secure:
- ✅ **Email Address**: Stored in Google Apps Script Properties (not visible in code)
- ✅ **Spreadsheet ID**: Stored in Google Apps Script Properties (not visible in code)
- ✅ **Fallback Protection**: Code still works even if properties aren't set
- ✅ **Environment Variables**: Next.js API route uses `.env.local` for the Google Apps Script URL

### How Properties Service Works:
- **Encrypted Storage**: Google Apps Script Properties Service encrypts your data
- **Access Control**: Only your script can access the properties
- **Not Visible**: Properties don't appear in your code when shared
- **Persistent**: Values persist across script executions

### Additional Security Tips:
1. **Never commit `.env.local`** to version control (already in .gitignore)
2. **Regularly rotate** your Google Apps Script web app URL if needed
3. **Monitor access** through Google Apps Script execution logs
4. **Use specific permissions** when sharing your script

## Step 6: Monitor and Debug

- Check Google Apps Script logs: In your script, go to "Executions" to see logs
- Check browser console for any errors
- Check Next.js terminal for API errors

## 📊 Configuration Summary

### What's Stored Securely:
- **Google Sheet ID**: Your sheet (1UzFs9ULLLpnKkc2xE1Tag0QhGOxjsV6J0KpRUSqGaXY)
- **Admin Email**: afrasvellora777@gmail.com
- **Email templates**: Professional templates included with gym details

### Email Features

**Admin Notification Email Includes:**
- New member details
- Registration timestamp  
- Direct link to Google Sheet
- Next steps checklist

**User Confirmation Email Includes:**
- Welcome message
- Gym location and contact details
- Training hours
- What to expect next
- Professional formatting

## 🛠 Management Functions

The script includes these helper functions:

### `setupSecureConfiguration()`
- Run this once to store your sensitive data securely
- Sets up encrypted storage for email and spreadsheet ID

### `clearSecureConfiguration()`
- Use this if you need to clear stored configuration
- Helpful for testing or changing settings

## 🚨 Troubleshooting

**If emails don't work:**
1. Check Google Apps Script execution logs
2. Verify the stored properties by running setupSecureConfiguration again
3. Check spam folders
4. Ensure Gmail API quota limits aren't exceeded

**If Google Sheet doesn't update:**
1. Verify Google Sheet ID is correct in the properties
2. Check that the Google Sheet is accessible by your Google account
3. Check Google Apps Script permissions
4. Look at the execution logs for specific errors

**If you get "Properties not found" errors:**
1. Run the `setupSecureConfiguration()` function
2. Check that the properties were saved correctly
3. The script has fallback values, so it should still work

## 🔄 Updating Configuration

To change your email or spreadsheet ID later:
1. Edit the values in `setupSecureConfiguration()` function
2. Run the function again
3. Check the logs to confirm the update

## 🎯 Best Practices

1. **Run setup once**: After initial setup, you don't need to run setupSecureConfiguration again
2. **Monitor logs**: Check execution logs regularly for any issues
3. **Test thoroughly**: Always test with a real form submission
4. **Keep backups**: Note down your spreadsheet ID and email separately
