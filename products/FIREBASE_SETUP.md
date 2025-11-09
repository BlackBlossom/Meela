# Firebase Setup Instructions

## Prerequisites
You need a Firebase account and a Firebase project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "meela-store")
4. Follow the setup wizard

## Step 2: Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
4. Select a Cloud Firestore location (choose one close to your users)
5. Click "Enable"

## Step 3: Set Firestore Security Rules

In the Firebase Console, go to Firestore Database > Rules and update them:

### For Testing (allows all reads/writes):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### For Production (recommended):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchaseHistory/{purchaseId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Click "Publish" to save the rules.

## Step 4: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Meela Web App")
6. Copy the Firebase configuration object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Update Your HTML File

Open `hair-growth-oil.html` and find this section (around line 2673):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace it with YOUR actual Firebase configuration values from Step 4.

## Step 6: Test the Integration

1. Open your website in a browser
2. Add a product to cart
3. Open the cart drawer
4. Click "Proceed to Checkout"
5. Check the browser console for success messages
6. Go to Firebase Console > Firestore Database
7. You should see a new collection called "purchaseHistory" with your order data

## Firestore Data Structure

Each purchase will be saved with this structure:

```javascript
{
  userId: "user_1234567890_abc123",
  items: [
    {
      id: "meela-hair-oil",
      title: "Ayurvedic Hair Growth Oil",
      price: 699.00,
      quantity: 1,
      image: "https://...",
      subtotal: 699.00
    }
  ],
  total: 699.00,
  timestamp: Timestamp,
  date: "2025-11-03T10:30:00.000Z",
  status: "pending"
}
```

## Features Implemented

✅ **Automatic User ID Generation**: Each user gets a unique ID stored in localStorage
✅ **Purchase History**: All cart items are saved to Firestore on checkout
✅ **Timestamp Tracking**: Server-side timestamp for accurate order time
✅ **Cart Clearing**: Cart is automatically cleared after successful order
✅ **Error Handling**: User-friendly error messages if Firebase fails

## Viewing Purchase History

To view all purchases in Firebase:

1. Go to Firebase Console
2. Click "Firestore Database"
3. Click on "purchaseHistory" collection
4. You'll see all orders with their IDs, timestamps, and data

## Querying Purchase History

You can query purchases by user:

```javascript
// Get all purchases for a specific user
const userId = localStorage.getItem('meelaUserId');
db.collection('purchaseHistory')
  .where('userId', '==', userId)
  .orderBy('timestamp', 'desc')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  });
```

## Troubleshooting

### Error: "Firebase not initialized"
- Make sure you replaced the Firebase config with your actual values
- Check browser console for initialization errors

### Error: "Missing or insufficient permissions"
- Update your Firestore security rules (see Step 3)
- Make sure you published the rules

### Error: "Network error"
- Check your internet connection
- Verify Firebase project is active
- Check if Firestore is enabled

## Security Notes

⚠️ **Important**: The current setup uses test mode for development. For production:

1. Enable proper authentication (Firebase Auth)
2. Update security rules to require authentication
3. Add server-side validation
4. Implement proper payment gateway integration

## Next Steps (Optional)

- Add Firebase Authentication for user login
- Create an admin panel to view all orders
- Send email confirmations using Firebase Cloud Functions
- Integrate with payment gateway
- Add order status tracking
