# Fix Conference Dropdown Issue - Step by Step Guide

## 🔍 Problem Identified

The sponsor registration form dropdown is not showing conferences because all existing conferences have dates in the past (even though they show 2025 dates, they are being treated as past dates).

## ✅ Solution: Update Conference Dates in Sanity Studio

### Step 1: Open Sanity Studio
1. Navigate to: `http://localhost:3333`
2. Make sure the Sanity backend is running

### Step 2: Access Conference Events
1. In the left sidebar, click on **"Conference Event"**
2. You should see a list of existing conferences

### Step 3: Update Each Conference Date
For each conference in the list:

1. **Click on the conference** to open it for editing
2. **Find the "Event Date" field**
3. **Click on the date picker**
4. **Select a future date** (any date after today)
   - Suggested dates:
     - Conference 1: Set to 30 days from today
     - Conference 2: Set to 60 days from today  
     - Conference 3: Set to 90 days from today
5. **Click "Publish" or "Save"** to save the changes

### Step 4: Verify the Fix
1. Go back to the sponsor registration form: `http://localhost:3000/sponsorship/register`
2. Refresh the page
3. Check the conference dropdown - it should now show the conferences
4. Open browser console (F12) to see debug logs confirming conferences are loaded

## 🚀 Expected Result

After updating the dates, the dropdown should display:
```
Choose a conference...
Paper New Example - [New Date] - India, Delhi
Research Publication - [New Date] - Nevada, USA  
Aesthetic - [New Date] - vizag
```

## 🔧 Alternative: Create New Conferences

If you prefer to create new conferences instead of updating existing ones:

### Step 1: Create New Conference
1. In Sanity Studio, click **"Create"** button
2. Select **"Conference Event"**

### Step 2: Fill Required Fields
- **Event Title**: "International AI Conference 2024"
- **Slug**: Will auto-generate from title
- **Event Poster**: Upload any image (required field)
- **Location**: "San Francisco, CA, USA"
- **Event Date**: Select a future date
- **Email**: "ai-conference@intelliglobalconferences.com"

### Step 3: Save and Repeat
1. Click **"Publish"**
2. Repeat for 2-3 more conferences with different titles and future dates

## 🧪 Testing Checklist

- [ ] Sanity Studio shows conferences with future dates
- [ ] Registration form dropdown loads conferences
- [ ] Can select a conference from dropdown
- [ ] Can proceed to Step 2 of registration form
- [ ] Browser console shows successful conference fetching logs

## 🔍 Debug Information

The registration form now includes enhanced debugging:
- Check browser console for detailed logs
- Shows total conferences found
- Shows filtering process for upcoming conferences
- Displays fallback behavior if no upcoming conferences

## 📞 If Issues Persist

1. **Check browser console** for error messages
2. **Verify Sanity backend is running** on port 3333
3. **Ensure frontend is running** on port 3000
4. **Check network tab** for failed API requests
5. **Verify conference dates** are actually in the future

The fix should resolve the dropdown issue and allow sponsors to proceed with registration.
