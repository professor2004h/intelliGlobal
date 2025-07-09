# Quick Fix Guide: Update URLs in Sanity Studio

## Problem
The "Research Publication" event has incomplete URLs stored in Sanity CMS:
- Current: `https://www.youtube.com` (23 characters)
- Should be: `https://www.youtube.com/watch?v=fqbSpK9z4dk` (43 characters)

## Solution Steps

### 1. Access Sanity Studio
- Open: http://localhost:3334
- You should see the Sanity Studio interface

### 2. Navigate to Conference Events
- Look for "Conference Event" in the left sidebar
- Click on it to see all events

### 3. Find Research Publication Event
- Look for the event titled "Research Publication"
- Click on it to edit

### 4. Update URL Fields
Replace the current URLs in these fields:

**Register Now Button URL:**
```
https://www.youtube.com/watch?v=fqbSpK9z4dk
```

**Submit Abstract Button URL:**
```
https://www.youtube.com/watch?v=fqbSpK9z4dk
```

### 5. Save Changes
- Click "Publish" or "Save" button
- Wait for confirmation

### 6. Test Frontend
- Go to: http://localhost:3000
- Find the "Research Publication" event card
- Click "Register Now" or "Submit Abstract" buttons
- They should now open the YouTube video in a new tab

## Expected Result
After fixing the URLs, the buttons should work correctly and open:
`https://www.youtube.com/watch?v=fqbSpK9z4dk`

## Current Status
- ✅ Sanity Studio running: http://localhost:3333
- ✅ Frontend running: http://localhost:3000
- ❌ URLs incomplete in Sanity data
- 🔧 **ACTION NEEDED**: Update URLs in Sanity Studio
