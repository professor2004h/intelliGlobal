# Sanity Special Registrations - Navigation Guide

**Created:** October 24, 2025  
**Purpose:** How to view the Special Registrations list/table view in Sanity Studio

---

## 🎯 Understanding Sanity Views

Sanity Studio has two main views for documents:

### 1. **List View** (What you want - looks like a table)
- Shows **all documents** of a type
- Displays multiple registrations at once
- Shows preview information (name, email, amount, etc.)
- Allows sorting and filtering
- **URL format:** `http://localhost:3333/structure/specialRegistration`

### 2. **Document View** (Single document editor)
- Shows **one specific document**
- Displays all fields for editing
- **URL format:** `http://localhost:3333/structure/specialRegistration;[document-id]`

---

## ✅ How to Access the List View (Table View)

### Method 1: Click in Sidebar (Recommended)
1. Open Sanity Studio: http://localhost:3333/
2. Look at the left sidebar under "Content"
3. Scroll to the bottom
4. Click on **"💎 Special Registrations (VIP Clients)"**
5. You should see a **list of all registrations**

### Method 2: Direct URL
Navigate directly to:
```
http://localhost:3333/structure/specialRegistration
```

### Method 3: From Document View
If you're viewing a single document:
1. Look at the breadcrumb at the top
2. Click on **"Special Registrations"** in the breadcrumb
3. This will take you back to the list view

---

## 📊 What You'll See in List View

### Empty State (No Registrations Yet)
If you haven't made any VIP payments yet, you'll see:
- Empty list message
- "Create" button to manually add a registration
- Sorting options in the top-right

### With Registrations
Each registration will show:

**Title Line:**
- Status emoji (⏳ pending, ✅ completed, ❌ failed, 💰 refunded)
- Client name

**Subtitle Line:**
- Conference name
- Payment amount (e.g., "USD 100.00")
- Registration date

**Description Line:**
- 📧 Email address
- 📞 Phone number
- 🆔 Transaction ID

### Example Display:
```
✅ John Doe
International Nursing Conference 2025 | USD 250.00 | 10/24/2025
📧 john.doe@example.com | 📞 +1234567890 | 🆔 PAYID-M123456

⏳ Jane Smith
Medical Research Summit | USD 500.00 | 10/23/2025
📧 jane.smith@example.com | 📞 +9876543210 | 🆔 PAYID-M789012
```

---

## 🔄 Sorting Options

In the list view, you can sort by:

1. **Registration Date (Newest First)** - Default
2. **Registration Date (Oldest First)**
3. **Payment Amount (Highest First)**
4. **Client Name (A-Z)**

**How to change sorting:**
1. Look for the sorting dropdown in the top-right corner
2. Click it to see all options
3. Select your preferred sorting

---

## 🔍 Filtering and Search

### Search
- Use the search box at the top to search by:
  - Client name
  - Email
  - Phone number
  - Transaction ID

### Filter by Status
While Sanity doesn't have built-in filters in the free tier, you can:
1. Use the search to find specific statuses
2. Sort by different criteria
3. Manually scan the list (status emoji helps!)

---

## 📝 Creating a Test Registration

To see how the list view looks with data:

### Option 1: Use VIP Payment Page
1. Go to: http://localhost:3000/vip-payment
2. Fill in the form with test data
3. Complete a PayPal payment (use sandbox)
4. Return to Sanity Studio
5. Refresh the Special Registrations list

### Option 2: Manual Creation (Testing Only)
1. In the list view, click "Create" button
2. Fill in all required fields:
   - Client Name
   - Title (Mr/Ms/Mrs/Prof/Dr)
   - Email
   - Phone Number
   - Conference (select from dropdown)
   - Payment Amount
   - Payment Status
3. Click "Publish"
4. You'll see it appear in the list

---

## 🎨 Visual Indicators

### Status Emojis
- ⏳ **Pending** - Payment initiated but not completed
- ✅ **Completed** - Payment successful
- ❌ **Failed** - Payment failed
- 💰 **Refunded** - Payment refunded

### Field Icons
- 📧 Email address
- 📞 Phone number
- 🆔 Transaction ID
- 💎 Special Registrations icon (in sidebar)

---

## 🔧 Troubleshooting

### Issue: "I don't see Special Registrations in the sidebar"

**Solution:**
1. Refresh the browser (F5 or Ctrl+R)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check terminal for errors
4. Restart Sanity Studio if needed

### Issue: "I only see one document, not a list"

**Solution:**
You're in **Document View**, not **List View**. 

**Fix:**
- Click "Special Registrations" in the breadcrumb at the top
- Or click "💎 Special Registrations (VIP Clients)" in the sidebar
- Or navigate to: http://localhost:3333/structure/specialRegistration

### Issue: "The list is empty"

**Solution:**
This is normal if you haven't made any VIP payments yet.

**To add test data:**
1. Use the VIP payment page to make a test payment
2. Or manually create a registration using the "Create" button

### Issue: "I can't see all the information"

**Solution:**
The list view shows a **preview** of each document. To see all fields:
1. Click on any registration in the list
2. This opens the full document view
3. You'll see all fields including notes, addresses, etc.

---

## 📱 List View Features

### Available Actions
- **Create** - Add new registration manually
- **Sort** - Change sorting order
- **Search** - Find specific registrations
- **Click** - Open document for editing
- **Refresh** - Reload the list

### Keyboard Shortcuts
- **↑/↓** - Navigate between items
- **Enter** - Open selected item
- **Cmd/Ctrl + K** - Quick search
- **Esc** - Close document view

---

## 🎯 Quick Navigation URLs

### List Views (Table-like)
- **Special Registrations:** http://localhost:3333/structure/specialRegistration
- **Payment Transactions:** http://localhost:3333/structure/paymentTransaction
- **Sponsor Registrations:** http://localhost:3333/structure/sponsorRegistration
- **Conference Events:** http://localhost:3333/structure/conferenceEvent

### Studio Home
- **Main Dashboard:** http://localhost:3333/

---

## 📊 Expected Workflow

### For Administrators:

1. **VIP client makes payment** on http://localhost:3000/vip-payment
2. **Payment processes** through PayPal
3. **Registration auto-created** in Sanity
4. **Email sent** to client
5. **Admin views** in Sanity Studio list view
6. **Admin can:**
   - See all registrations at a glance
   - Sort by date, amount, or name
   - Search for specific clients
   - Click to view full details
   - Add internal notes
   - Check email delivery status

---

## 🔗 Related Documentation

- **VIP Payment System:** See `VIP_PAYMENT_SYSTEM_DOCUMENTATION.md`
- **Quick Start:** See `VIP_PAYMENT_QUICK_START.md`
- **Implementation:** See `VIP_PAYMENT_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist

To verify everything is working:

- [ ] Can access Sanity Studio at http://localhost:3333/
- [ ] Can see "💎 Special Registrations (VIP Clients)" in sidebar
- [ ] Clicking it shows the list view (not a single document)
- [ ] Can see sorting options in top-right
- [ ] Can create a test registration
- [ ] Test registration appears in the list
- [ ] Can click on registration to view details
- [ ] Can navigate back to list view using breadcrumb

---

## 🎉 Summary

**To see the "table view" of Special Registrations:**

1. ✅ Open: http://localhost:3333/
2. ✅ Click: "💎 Special Registrations (VIP Clients)" in sidebar
3. ✅ View: List of all registrations with preview info
4. ✅ Sort: Use dropdown in top-right
5. ✅ Click any item: To see full details

**Direct URL:** http://localhost:3333/structure/specialRegistration

---

**Status:** ✅ Special Registrations list view is ready and accessible!

