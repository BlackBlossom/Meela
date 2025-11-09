# Cloudinary Setup Instructions for Meela Admin Panel

## Step 1: Create a Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account (includes 25 GB storage and 25 GB bandwidth per month)
3. Verify your email

## Step 2: Get Your Cloudinary Credentials
1. Log into your Cloudinary dashboard: https://console.cloudinary.com/
2. You'll see your **Cloud Name** on the dashboard
3. Note down your **Cloud Name** (e.g., `dj3kxabcd`)

## Step 3: Create an Upload Preset
1. Go to **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Signing Mode**: Select **Unsigned** (for client-side uploads)
   - **Preset name**: Choose a name (e.g., `meela_products`)
   - **Folder**: Enter `meela-products` (optional, for organization)
   - **Allowed formats**: Select image formats (jpg, png, webp, etc.)
5. Click **Save**
6. Note down your **Upload Preset Name**

## Step 4: Update admin.js Configuration
1. Open `admin.js` file
2. Find lines 4-5 at the top of the file:
```javascript
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Replace with your preset name
```

3. Replace with your actual values:
```javascript
const CLOUDINARY_CLOUD_NAME = 'dj3kxabcd'; // Your cloud name from Step 2
const CLOUDINARY_UPLOAD_PRESET = 'meela_products'; // Your preset name from Step 3
```

4. Save the file

## Step 5: Test the Upload
1. Open your admin panel
2. Log in as admin
3. Click the **Upload Image** button
4. Select an image and enter a title
5. Click **Upload**
6. The image will be uploaded to Cloudinary and the URL will be saved in your Firebase database

## Features Implemented
✅ **Upload to Cloudinary**: Images are stored on Cloudinary's CDN
✅ **Metadata Storage**: Image URLs and info saved in Firebase Firestore
✅ **Image Gallery**: View all uploaded images
✅ **Copy URL**: One-click copy of image URLs
✅ **Progress Indicator**: Real-time upload progress
✅ **Image Preview**: Preview before uploading
✅ **Folder Organization**: Images stored in `meela-products` folder

## Image URLs
After upload, you'll get URLs like:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/meela-products/filename.jpg
```

You can use these URLs directly in your product pages!

## Cloudinary Transformations (Bonus)
You can transform images on-the-fly by modifying the URL:

### Resize to 300x300:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_300,h_300,c_fill/meela-products/filename.jpg
```

### Create thumbnail (100x100):
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_100,h_100,c_thumb/meela-products/filename.jpg
```

### Auto-optimize quality:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/q_auto,f_auto/meela-products/filename.jpg
```

## Troubleshooting

### Error: "Please configure your Cloudinary credentials"
- Make sure you updated `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` in admin.js

### Error: "Upload failed: 401"
- Your upload preset might be signed. Make sure it's set to **Unsigned** in Cloudinary settings

### Error: "Upload failed: 400"
- Check that your cloud name is correct
- Verify the upload preset name matches exactly

## Security Note
The unsigned upload preset is safe for client-side uploads because:
- It's restricted to images only
- You can set file size limits in Cloudinary
- You can enable moderation in Cloudinary settings
- No API secret is exposed in the frontend code

## Need Help?
Contact Cloudinary support: https://support.cloudinary.com/
