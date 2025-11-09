# Meela Herbals - E-Commerce Store

A modern, custom-built e-commerce website for Meela Herbals featuring Ayurvedic hair care products with integrated Firebase backend for order management.

![Meela Store](product1.png)

## 🌟 Features

### ✅ Product Management
- Beautiful product showcase with image gallery
- Detailed product information and specifications
- Ingredient lists and usage instructions
- Product recommendations

### 🛒 Shopping Cart System
- Custom-built cart functionality (no Shopify dependency)
- Real-time cart updates
- Quantity controls (+/-)
- Product image, price, and subtotal display
- Persistent cart using localStorage
- Cart count indicator in header

### 🔥 Firebase Integration
- Real-time order tracking
- Purchase history storage
- Automatic user ID generation
- Server-side timestamp tracking
- Secure Firestore database

### 💳 Checkout Process
- One-click "Proceed to Checkout" button
- Automatic order submission to Firebase
- Order confirmation with unique Order ID
- Cart clearing after successful checkout

### 🎨 User Interface
- Responsive design (mobile & desktop)
- Smooth animations and transitions
- Sticky header with cart icon
- Slide-out cart drawer
- Clean, modern aesthetics

## 📁 Project Structure

```
meela/
├── index.htm                          # Homepage
├── collections.html                   # Products collection page
├── products/
│   ├── hair-growth-oil.html          # Product detail page
│   ├── cart-fix.js                   # Custom cart functionality
│   └── FIREBASE_SETUP.md             # Firebase configuration guide
├── assets/
│   └── js/
│       └── appstle-subscription.min.js
├── cdn/
│   └── shop/
│       └── t/38/assets/
│           ├── app.js                 # Shopify theme scripts
│           └── app.css                # Theme styles
└── README.md                          # This file
```

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (for order management)
- Live server or local development server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/meela-store.git
   cd meela-store
   ```

2. **Set up Firebase** (See detailed instructions in `products/FIREBASE_SETUP.md`)
   - Create a Firebase project
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Update `products/hair-growth-oil.html` with your config

3. **Run the project**
   - Open with Live Server (VS Code extension)
   - Or use Python: `python -m http.server 5500`
   - Or use Node.js: `npx serve`

4. **Access the store**
   - Open `http://localhost:5500` in your browser
   - Navigate to products and test the cart functionality

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Copy your configuration from Project Settings
5. Update the config in `products/hair-growth-oil.html`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

For detailed setup instructions, see: [`products/FIREBASE_SETUP.md`](products/FIREBASE_SETUP.md)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Firestore (NoSQL Database)
- **Storage**: localStorage (for cart persistence)
- **CDN**: Firebase CDN, Shopify CDN (for assets)
- **Version Control**: Git & GitHub

## 📦 Key Components

### 1. Cart System (`cart-fix.js`)
- Custom cart implementation
- Intercepts Shopify form submissions
- Manages cart state in localStorage
- Real-time UI updates
- Quantity management

### 2. Firebase Integration
- Automatic user identification
- Order data structure:
  ```javascript
  {
    userId: "user_xxx",
    items: [{
      id: "product-id",
      title: "Product Name",
      price: 699.00,
      quantity: 1,
      image: "url",
      subtotal: 699.00
    }],
    total: 699.00,
    timestamp: ServerTimestamp,
    date: "ISO-8601",
    status: "pending"
  }
  ```

### 3. Product Pages
- Dynamic product display
- Image galleries with thumbnails
- Accordion sections for info
- Add to Cart functionality
- Quantity selectors

## 🎯 Features in Detail

### Add to Cart
- Click "Add to Cart" button
- Product added to localStorage
- Cart count updates in header
- Cart drawer can be opened
- Visual feedback on success

### Cart Management
- View all items in cart
- Adjust quantities with +/- buttons
- Remove individual items
- See real-time subtotals and total
- Persistent across page reloads

### Checkout Process
1. User adds products to cart
2. Reviews cart contents
3. Clicks "Proceed to Checkout"
4. Order saved to Firebase automatically
5. Receives Order ID confirmation
6. Cart cleared after successful order

## 📊 Firebase Data Structure

### Collection: `purchaseHistory`

Each document contains:
- `userId`: Unique user identifier
- `items`: Array of products ordered
- `total`: Order total amount
- `timestamp`: Server timestamp
- `date`: ISO date string
- `status`: Order status (pending/completed)

## 🔐 Security

### Current Implementation
- Test mode for development
- Client-side validation
- localStorage for user tracking
- Firestore security rules needed

### Recommended for Production
- Enable Firebase Authentication
- Update Firestore security rules
- Add server-side validation
- Implement payment gateway
- Add SSL certificate
- Sanitize user inputs

## 🐛 Troubleshooting

### Cart not updating?
- Check browser console for errors
- Verify localStorage is enabled
- Clear browser cache and reload

### Firebase errors?
- Verify Firebase configuration is correct
- Check Firestore security rules
- Ensure internet connection
- Check Firebase Console for quotas

### Proceed to Checkout not working?
- Open browser console
- Check if Firebase is initialized
- Verify Firestore is enabled
- Check security rules allow writes

## 📝 Development Notes

### API Blocking
The project blocks Shopify API calls to `/cart/add.js` and `/cart.js` since we use a custom cart implementation. This is done via fetch/XHR interceptors in the HTML head.

### Cart State
Cart data is stored in localStorage under the key `meelaCart` as a JSON array.

### User Identification
Each user gets a unique ID stored in localStorage under `meelaUserId`.

## 🚀 Deployment

### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Choose main branch, root folder
# Access at: https://YOUR_USERNAME.github.io/meela-store/
```

### Custom Domain
1. Add CNAME file with your domain
2. Update DNS records
3. Enable HTTPS in GitHub settings

### Other Hosting Options
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Meela Herbals for the product information
- Firebase for backend services
- Shopify theme for UI components

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: your-email@example.com
- Website: https://www.meelaherbals.com

## 🗺️ Roadmap

- [ ] User authentication system
- [ ] Admin dashboard for order management
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Order status tracking
- [ ] Customer reviews and ratings
- [ ] Search functionality
- [ ] Product filters and sorting
- [ ] Wishlist feature
- [ ] Multiple product support

## 📸 Screenshots

### Homepage
![Homepage](index.htm)

### Product Page
![Product Page](products/hair-growth-oil.html)

### Cart Drawer
Shopping cart with quantity controls and checkout button.

---

**Built with ❤️ for Meela Herbals**
