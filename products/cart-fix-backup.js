// Cart Fix - Direct Button Interception
(function() {
  'use strict';
  
  console.log('[CART-FIX] Loading...');
  
  let cart = JSON.parse(localStorage.getItem('meelaCart')) || [];
  
  const productData = {
    id: 'meela-hair-oil',
    title: 'Ayurvedic Hair Growth Oil',
    price: 699.00,
    image: 'https://www.meelaherbals.com/cdn/shop/files/Artboard_13.png?v=1756315856&width=246'
  };

  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.innerHTML = 'Cart' + (totalItems > 0 ? ' (' + totalItems + ')' : '');
    }
  }

  function openCartDrawer() {
    const cartSlideOver = document.getElementById('cart');
    const cartAside = cartSlideOver ? cartSlideOver.querySelector('.slideover') : null;
    if (cartSlideOver && cartAside) {
      cartSlideOver.classList.add('active');
      cartAside.classList.add('active');
      // Don't lock body scroll - allow scrolling
      // document.body.style.overflow = 'hidden';
    }
  }

  function updateCartDisplay() {
    const cartSection = document.querySelector('.shopify-cart__update-section');
    if (!cartSection) return;

    if (cart.length === 0) {
      cartSection.innerHTML = '<div class="grid grid-cols-1 h-full grid-rows-2"><div class="flex items-center justify-center"><span>Your cart is empty</span></div></div>';
    } else {
      // Check if address is saved
      const savedAddress = localStorage.getItem('meelaUserAddress');
      const addressData = savedAddress ? JSON.parse(savedAddress) : null;
      
      let cartHTML = '<div style="padding:15px;">';
      let total = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += '<div style="display:flex;gap:15px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #ddd;">';
        cartHTML += '<img src="' + item.image + '" alt="' + item.title + '" style="width:80px;height:80px;object-fit:cover;">';
        cartHTML += '<div style="flex:1;">';
        cartHTML += '<h3 style="font-size:16px;margin-bottom:8px;font-weight:500;">' + item.title + '</h3>';
        cartHTML += '<p style="font-size:14px;margin-bottom:8px;">Price: ₹' + item.price.toFixed(2) + '</p>';
        cartHTML += '<div style="display:flex;align-items:center;gap:10px;margin:8px 0;">';
        cartHTML += '<button class="qty-btn qty-dec" data-index="' + index + '" style="padding:5px 10px;border:1px solid #ccc;background:#fff;cursor:pointer;">-</button>';
        cartHTML += '<span style="font-size:14px;">Qty: ' + item.quantity + '</span>';
        cartHTML += '<button class="qty-btn qty-inc" data-index="' + index + '" style="padding:5px 10px;border:1px solid #ccc;background:#fff;cursor:pointer;">+</button>';
        cartHTML += '</div>';
        cartHTML += '<p style="font-size:14px;margin-top:8px;">Subtotal: ₹' + itemTotal.toFixed(2) + '</p>';
        cartHTML += '</div>';
        cartHTML += '<button class="remove-item" data-index="' + index + '" style="color:#999;cursor:pointer;text-decoration:underline;font-size:13px;">Remove</button>';
        cartHTML += '</div>';
      });

      cartHTML += '<div style="margin-top:20px;padding-top:20px;border-top:1px solid #ddd;">';
      cartHTML += '<div style="display:flex;justify-content:space-between;font-weight:500;font-size:18px;margin-bottom:20px;">';
      cartHTML += '<span>Total:</span><span>₹' + total.toFixed(2) + '</span>';
      cartHTML += '</div>';
      
      // Address Section
      cartHTML += '<div id="address-section" style="margin-bottom:15px;padding:15px;background:#f9f9f9;border-radius:5px;">';
      if (addressData) {
        cartHTML += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">';
        cartHTML += '<div><strong>Delivery Address:</strong></div>';
        cartHTML += '<button id="edit-address-btn" style="color:#0066cc;text-decoration:underline;background:none;border:none;cursor:pointer;font-size:13px;">Edit</button>';
        cartHTML += '</div>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.name + ' | ' + addressData.phone + '</p>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.email + '</p>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.address + '</p>';
      } else {
        cartHTML += '<p style="font-size:14px;margin-bottom:10px;color:#666;">Please add your delivery address</p>';
        cartHTML += '<button id="add-address-btn" style="width:100%;padding:12px;background:#fff;color:#000;border:1px solid #000;cursor:pointer;font-size:14px;border-radius:3px;">+ Add Address</button>';
      }
      cartHTML += '</div>';
      
      // Address Form (Initially Hidden)
      cartHTML += '<div id="address-form-container" style="display:none;margin-bottom:15px;padding:15px;background:#f9f9f9;border-radius:5px;">';
      cartHTML += '<h3 style="font-size:16px;margin-bottom:15px;font-weight:500;">Delivery Address</h3>';
      cartHTML += '<form id="address-form">';
      cartHTML += '<input type="text" id="addr-name" placeholder="Full Name *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<input type="email" id="addr-email" placeholder="Email Address *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<input type="tel" id="addr-phone" placeholder="Phone Number *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<textarea id="addr-address" placeholder="Complete Address (House No, Street, City, State, PIN) *" required rows="3" style="width:100%;padding:10px;margin-bottom:15px;border:1px solid #ddd;border-radius:3px;font-size:14px;resize:vertical;"></textarea>';
      cartHTML += '<div style="display:flex;gap:10px;">';
      cartHTML += '<button type="submit" style="flex:1;padding:12px;background:#000;color:#fff;border:none;cursor:pointer;border-radius:3px;">Save Address</button>';
      cartHTML += '<button type="button" id="cancel-address-btn" style="flex:1;padding:12px;background:#fff;color:#000;border:1px solid #ccc;cursor:pointer;border-radius:3px;">Cancel</button>';
      cartHTML += '</div>';
      cartHTML += '</form>';
      cartHTML += '</div>';
      
      // Proceed to Pay Button
      if (addressData) {
        cartHTML += '<button id="proceed-checkout-btn" style="width:100%;padding:15px;background:#000;color:#fff;border:none;cursor:pointer;font-weight:500;font-size:15px;">Proceed to Pay</button>';
      } else {
        cartHTML += '<button disabled style="width:100%;padding:15px;background:#ccc;color:#666;border:none;cursor:not-allowed;font-weight:500;font-size:15px;">Proceed to Pay</button>';
        cartHTML += '<p style="font-size:12px;color:#999;margin-top:8px;text-align:center;">Please add delivery address to continue</p>';
      }
      
      cartHTML += '</div></div>';

      cartSection.innerHTML = cartHTML;

      // Attach event handlers
      document.querySelectorAll('.qty-inc').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cart[parseInt(this.dataset.index)].quantity++;
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      document.querySelectorAll('.qty-dec').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          if (cart[index].quantity > 1) {
            cart[index].quantity--;
          } else {
            cart.splice(index, 1);
          }
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      document.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cart.splice(parseInt(this.dataset.index), 1);
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      // Attach checkout button handler
      const checkoutBtn = document.getElementById('proceed-checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
          savePurchaseToFirebase();
        });
      }

      // Add Address button handler
      const addAddressBtn = document.getElementById('add-address-btn');
      if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
          showAddressForm();
        });
      }

      // Edit Address button handler
      const editAddressBtn = document.getElementById('edit-address-btn');
      if (editAddressBtn) {
        editAddressBtn.addEventListener('click', function() {
          showAddressForm(true);
        });
      }

      // Address form submit handler
      const addressForm = document.getElementById('address-form');
      if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
          e.preventDefault();
          saveAddress();
        });
      }

      // Cancel address button handler
      const cancelAddressBtn = document.getElementById('cancel-address-btn');
      if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
          hideAddressForm();
        });
      }
    }
  }

  function showAddressForm(isEdit) {
    const addressSection = document.getElementById('address-section');
    const addressFormContainer = document.getElementById('address-form-container');
    
    if (addressSection) addressSection.style.display = 'none';
    if (addressFormContainer) addressFormContainer.style.display = 'block';

    // If editing, populate the form
    if (isEdit) {
      const savedAddress = localStorage.getItem('meelaUserAddress');
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        document.getElementById('addr-name').value = addressData.name || '';
        document.getElementById('addr-email').value = addressData.email || '';
        document.getElementById('addr-phone').value = addressData.phone || '';
        document.getElementById('addr-address').value = addressData.address || '';
      }
    }
  }

  function hideAddressForm() {
    const addressSection = document.getElementById('address-section');
    const addressFormContainer = document.getElementById('address-form-container');
    
    if (addressSection) addressSection.style.display = 'block';
    if (addressFormContainer) addressFormContainer.style.display = 'none';
    
    // Clear form
    document.getElementById('address-form').reset();
  }

  function saveAddress() {
    const name = document.getElementById('addr-name').value.trim();
    const email = document.getElementById('addr-email').value.trim();
    const phone = document.getElementById('addr-phone').value.trim();
    const address = document.getElementById('addr-address').value.trim();

    if (!name || !email || !phone || !address) {
      alert('Please fill all the fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Basic phone validation (allow international/local variable lengths)
    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    const addressData = {
      name: name,
      email: email,
      phone: phone,
      address: address
    };

    localStorage.setItem('meelaUserAddress', JSON.stringify(addressData));
    console.log('[CART-FIX] Address saved');
    
    // Refresh cart display
    updateCartDisplay();
  }

  function showSuccessPopup(orderId) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'order-success-popup';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = 'background:#fff;padding:40px;border-radius:10px;max-width:450px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.2);';
    
    popup.innerHTML = `
      <div style="margin-bottom:20px;">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;">
          <circle cx="40" cy="40" r="38" stroke="#4CAF50" stroke-width="4" fill="#E8F5E9"/>
          <path d="M25 40L35 50L55 30" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="font-size:24px;font-weight:600;margin-bottom:15px;color:#333;">Order Placed Successfully!</h2>
      <p style="font-size:16px;color:#666;margin-bottom:10px;">Thank you for your purchase</p>
      <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
        <p style="font-size:14px;color:#999;margin-bottom:5px;">Order ID</p>
        <p style="font-size:16px;font-weight:600;color:#333;font-family:monospace;">${orderId}</p>
      </div>
      <p style="font-size:14px;color:#666;margin-bottom:25px;">We'll send you an email confirmation shortly</p>
      <button id="close-popup-btn" style="background:#000;color:#fff;border:none;padding:12px 40px;border-radius:5px;cursor:pointer;font-size:15px;font-weight:500;">Continue Shopping</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close button handler
    document.getElementById('close-popup-btn').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  function showErrorPopup(message) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'order-error-popup';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = 'background:#fff;padding:40px;border-radius:10px;max-width:450px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.2);';
    
    popup.innerHTML = `
      <div style="margin-bottom:20px;">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;">
          <circle cx="40" cy="40" r="38" stroke="#f44336" stroke-width="4" fill="#ffebee"/>
          <path d="M30 30L50 50M50 30L30 50" stroke="#f44336" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 style="font-size:24px;font-weight:600;margin-bottom:15px;color:#333;">Order Failed</h2>
      <p style="font-size:16px;color:#666;margin-bottom:25px;">${message}</p>
      <button id="close-error-popup-btn" style="background:#f44336;color:#fff;border:none;padding:12px 40px;border-radius:5px;cursor:pointer;font-size:15px;font-weight:500;">Try Again</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close button handler
    document.getElementById('close-error-popup-btn').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  // Firebase function to save purchase history
  function savePurchaseToFirebase() {
    if (!window.db) {
      console.error('[FIREBASE] Firestore not initialized');
      showErrorPopup('Firebase is not configured. Please check your Firebase settings.');
      return;
    }

    if (cart.length === 0) {
      showErrorPopup('Your cart is empty!');
      return;
    }

    // Check if address is provided
    const savedAddress = localStorage.getItem('meelaUserAddress');
    if (!savedAddress) {
      showErrorPopup('Please add your delivery address before proceeding to payment.');
      return;
    }

    const addressData = JSON.parse(savedAddress);

    // Calculate total
    let total = 0;
    cart.forEach(function(item) {
      total += item.price * item.quantity;
    });

    // Generate a unique user ID (you can replace this with actual user authentication)
    let userId = localStorage.getItem('meelaUserId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('meelaUserId', userId);
    }

    // Prepare purchase data with address
    const purchaseData = {
      userId: userId,
      customerInfo: {
        name: addressData.name,
        email: addressData.email,
        phone: addressData.phone,
        address: addressData.address
      },
      items: cart.map(function(item) {
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          subtotal: item.price * item.quantity
        };
      }),
      total: total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      date: new Date().toISOString(),
      status: 'pending'
    };

    console.log('[FIREBASE] Saving purchase:', purchaseData);

    // Save to Firestore
    window.db.collection('purchaseHistory')
      .add(purchaseData)
      .then(function(docRef) {
        console.log('[FIREBASE] Purchase saved with ID:', docRef.id);
        
        // Clear cart after successful save
        cart = [];
        localStorage.setItem('meelaCart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        
        // Show success popup
        showSuccessPopup(docRef.id);
        
        // Close cart drawer
        const cartDrawer = document.getElementById('cart');
        if (cartDrawer) {
          cartDrawer.classList.remove('active');
          const cartAside = cartDrawer.querySelector('.slideover');
          if (cartAside) cartAside.classList.remove('active');
        }
      })
      .catch(function(error) {
        console.error('[FIREBASE] Error saving purchase:', error);
        showErrorPopup('Failed to process your order. Please try again.');
      });
  }

  function addToCart(quantity) {
    console.log('[CART-FIX] Adding', quantity, 'item(s)');
    
    const existingIndex = cart.findIndex(function(item) { return item.id === productData.id; });
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: productData.id,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('meelaCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    setTimeout(function() {
      openCartDrawer();
      var trigger = document.getElementById('cart-trigger');
      if (trigger) trigger.click();
    }, 50);
    
    console.log('[CART-FIX] Cart updated:', cart);
  }

  // Setup button click handler for BOTH forms
  function setupButtonHandler() {
    setTimeout(function() {
      console.log('[CART-FIX] Looking for Add to Cart button...');
      
      // Find the main product form (now the only form)
      const mainForm = document.querySelector('form[data-type="custom-cart-form"]') ||
                      document.querySelector('form#main-product-add-form');
      
      if (!mainForm) {
        console.error('[CART-FIX] Main product form not found!');
        return;
      }

      console.log('[CART-FIX] Found main product form');

      // Setup main form button
      const mainBtn = mainForm.querySelector('button[type="submit"]');
      if (mainBtn) {
        console.log('[CART-FIX] Setting up Add to Cart button');
        
        mainBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          console.log('[CART-FIX] *** ADD TO CART CLICKED ***');
          
          const qtyInput = mainForm.querySelector('input[type="number"][name="quantity"]') ||
                          mainForm.querySelector('input[id*="qty"]') ||
                          mainForm.querySelector('input.quantity__input');
          const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
          
          console.log('[CART-FIX] Quantity:', qty);
          addToCart(qty);
          
          return false;
        }, true);

        mainForm.onsubmit = function(e) {
          e.preventDefault();
          return false;
        };
      }

      console.log('[CART-FIX] Handler installed successfully');
    }, 800); // Wait for app.js to load
  }

  // Initialize
  function init() {
    console.log('[CART-FIX] Initializing...');
    updateCartCount();
    updateCartDisplay();
    setupButtonHandler();
    console.log('[CART-FIX] Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
// Cart Fix - Direct Button Interception
(function() {
  'use strict';
  
  console.log('[CART-FIX] Loading...');
  
  let cart = JSON.parse(localStorage.getItem('meelaCart')) || [];
  
  const productData = {
    id: 'meela-hair-oil',
    title: 'Ayurvedic Hair Growth Oil',
    price: 699.00,
    image: 'https://www.meelaherbals.com/cdn/shop/files/Artboard_13.png?v=1756315856&width=246'
  };

  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.innerHTML = 'Cart' + (totalItems > 0 ? ' (' + totalItems + ')' : '');
    }
  }

  function openCartDrawer() {
    const cartSlideOver = document.getElementById('cart');
    const cartAside = cartSlideOver ? cartSlideOver.querySelector('.slideover') : null;
    if (cartSlideOver && cartAside) {
      cartSlideOver.classList.add('active');
      cartAside.classList.add('active');
      // Don't lock body scroll - allow scrolling
      // document.body.style.overflow = 'hidden';
    }
  }

  function updateCartDisplay() {
    const cartSection = document.querySelector('.shopify-cart__update-section');
    if (!cartSection) return;

    if (cart.length === 0) {
      cartSection.innerHTML = '<div class="grid grid-cols-1 h-full grid-rows-2"><div class="flex items-center justify-center"><span>Your cart is empty</span></div></div>';
    } else {
      // Check if address is saved
      const savedAddress = localStorage.getItem('meelaUserAddress');
      const addressData = savedAddress ? JSON.parse(savedAddress) : null;
      
      let cartHTML = '<div style="padding:15px;">';
      let total = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += '<div style="display:flex;gap:15px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #ddd;">';
        cartHTML += '<img src="' + item.image + '" alt="' + item.title + '" style="width:80px;height:80px;object-fit:cover;">';
        cartHTML += '<div style="flex:1;">';
        cartHTML += '<h3 style="font-size:16px;margin-bottom:8px;font-weight:500;">' + item.title + '</h3>';
        cartHTML += '<p style="font-size:14px;margin-bottom:8px;">Price: ₹' + item.price.toFixed(2) + '</p>';
        cartHTML += '<div style="display:flex;align-items:center;gap:10px;margin:8px 0;">';
        cartHTML += '<button class="qty-btn qty-dec" data-index="' + index + '" style="padding:5px 10px;border:1px solid #ccc;background:#fff;cursor:pointer;">-</button>';
        cartHTML += '<span style="font-size:14px;">Qty: ' + item.quantity + '</span>';
        cartHTML += '<button class="qty-btn qty-inc" data-index="' + index + '" style="padding:5px 10px;border:1px solid #ccc;background:#fff;cursor:pointer;">+</button>';
        cartHTML += '</div>';
        cartHTML += '<p style="font-size:14px;margin-top:8px;">Subtotal: ₹' + itemTotal.toFixed(2) + '</p>';
        cartHTML += '</div>';
        cartHTML += '<button class="remove-item" data-index="' + index + '" style="color:#999;cursor:pointer;text-decoration:underline;font-size:13px;">Remove</button>';
        cartHTML += '</div>';
      });

      cartHTML += '<div style="margin-top:20px;padding-top:20px;border-top:1px solid #ddd;">';
      cartHTML += '<div style="display:flex;justify-content:space-between;font-weight:500;font-size:18px;margin-bottom:20px;">';
      cartHTML += '<span>Total:</span><span>₹' + total.toFixed(2) + '</span>';
      cartHTML += '</div>';
      
      // Address Section
      cartHTML += '<div id="address-section" style="margin-bottom:15px;padding:15px;background:#f9f9f9;border-radius:5px;">';
      if (addressData) {
        cartHTML += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">';
        cartHTML += '<div><strong>Delivery Address:</strong></div>';
        cartHTML += '<button id="edit-address-btn" style="color:#0066cc;text-decoration:underline;background:none;border:none;cursor:pointer;font-size:13px;">Edit</button>';
        cartHTML += '</div>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.name + ' | ' + addressData.phone + '</p>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.email + '</p>';
        cartHTML += '<p style="font-size:14px;margin:5px 0;">' + addressData.address + '</p>';
      } else {
        cartHTML += '<p style="font-size:14px;margin-bottom:10px;color:#666;">Please add your delivery address</p>';
        cartHTML += '<button id="add-address-btn" style="width:100%;padding:12px;background:#fff;color:#000;border:1px solid #000;cursor:pointer;font-size:14px;border-radius:3px;">+ Add Address</button>';
      }
      cartHTML += '</div>';
      
      // Address Form (Initially Hidden)
      cartHTML += '<div id="address-form-container" style="display:none;margin-bottom:15px;padding:15px;background:#f9f9f9;border-radius:5px;">';
      cartHTML += '<h3 style="font-size:16px;margin-bottom:15px;font-weight:500;">Delivery Address</h3>';
      cartHTML += '<form id="address-form">';
      cartHTML += '<input type="text" id="addr-name" placeholder="Full Name *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<input type="email" id="addr-email" placeholder="Email Address *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<input type="tel" id="addr-phone" placeholder="Phone Number *" required style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #ddd;border-radius:3px;font-size:14px;">';
      cartHTML += '<textarea id="addr-address" placeholder="Complete Address (House No, Street, City, State, PIN) *" required rows="3" style="width:100%;padding:10px;margin-bottom:15px;border:1px solid #ddd;border-radius:3px;font-size:14px;resize:vertical;"></textarea>';
      cartHTML += '<div style="display:flex;gap:10px;">';
      cartHTML += '<button type="submit" style="flex:1;padding:12px;background:#000;color:#fff;border:none;cursor:pointer;border-radius:3px;">Save Address</button>';
      cartHTML += '<button type="button" id="cancel-address-btn" style="flex:1;padding:12px;background:#fff;color:#000;border:1px solid #ccc;cursor:pointer;border-radius:3px;">Cancel</button>';
      cartHTML += '</div>';
      cartHTML += '</form>';
      cartHTML += '</div>';
      
      // Proceed to Pay Button
      if (addressData) {
        cartHTML += '<button id="proceed-checkout-btn" style="width:100%;padding:15px;background:#000;color:#fff;border:none;cursor:pointer;font-weight:500;font-size:15px;">Proceed to Pay</button>';
      } else {
        cartHTML += '<button disabled style="width:100%;padding:15px;background:#ccc;color:#666;border:none;cursor:not-allowed;font-weight:500;font-size:15px;">Proceed to Pay</button>';
        cartHTML += '<p style="font-size:12px;color:#999;margin-top:8px;text-align:center;">Please add delivery address to continue</p>';
      }
      
      cartHTML += '</div></div>';

      cartSection.innerHTML = cartHTML;

      // Attach event handlers
      document.querySelectorAll('.qty-inc').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cart[parseInt(this.dataset.index)].quantity++;
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      document.querySelectorAll('.qty-dec').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          if (cart[index].quantity > 1) {
            cart[index].quantity--;
          } else {
            cart.splice(index, 1);
          }
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      document.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cart.splice(parseInt(this.dataset.index), 1);
          localStorage.setItem('meelaCart', JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });

      // Attach checkout button handler
      const checkoutBtn = document.getElementById('proceed-checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
          savePurchaseToFirebase();
        });
      }

      // Add Address button handler
      const addAddressBtn = document.getElementById('add-address-btn');
      if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
          showAddressForm();
        });
      }

      // Edit Address button handler
      const editAddressBtn = document.getElementById('edit-address-btn');
      if (editAddressBtn) {
        editAddressBtn.addEventListener('click', function() {
          showAddressForm(true);
        });
      }

      // Address form submit handler
      const addressForm = document.getElementById('address-form');
      if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
          e.preventDefault();
          saveAddress();
        });
      }

      // Cancel address button handler
      const cancelAddressBtn = document.getElementById('cancel-address-btn');
      if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
          hideAddressForm();
        });
      }
    }
  }

  function showAddressForm(isEdit) {
    const addressSection = document.getElementById('address-section');
    const addressFormContainer = document.getElementById('address-form-container');
    
    if (addressSection) addressSection.style.display = 'none';
    if (addressFormContainer) addressFormContainer.style.display = 'block';

    // If editing, populate the form
    if (isEdit) {
      const savedAddress = localStorage.getItem('meelaUserAddress');
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        document.getElementById('addr-name').value = addressData.name || '';
        document.getElementById('addr-email').value = addressData.email || '';
        document.getElementById('addr-phone').value = addressData.phone || '';
        document.getElementById('addr-address').value = addressData.address || '';
      }
    }
  }

  function hideAddressForm() {
    const addressSection = document.getElementById('address-section');
    const addressFormContainer = document.getElementById('address-form-container');
    
    if (addressSection) addressSection.style.display = 'block';
    if (addressFormContainer) addressFormContainer.style.display = 'none';
    
    // Clear form
    document.getElementById('address-form').reset();
  }

  function saveAddress() {
    const name = document.getElementById('addr-name').value.trim();
    const email = document.getElementById('addr-email').value.trim();
    const phone = document.getElementById('addr-phone').value.trim();
    const address = document.getElementById('addr-address').value.trim();

    if (!name || !email || !phone || !address) {
      alert('Please fill all the fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const addressData = {
      name: name,
      email: email,
      phone: phone,
      address: address
    };

    localStorage.setItem('meelaUserAddress', JSON.stringify(addressData));
    console.log('[CART-FIX] Address saved');
    
    // Refresh cart display
    updateCartDisplay();
  }

  function showSuccessPopup(orderId) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'order-success-popup';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = 'background:#fff;padding:40px;border-radius:10px;max-width:450px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.2);';
    
    popup.innerHTML = `
      <div style="margin-bottom:20px;">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;">
          <circle cx="40" cy="40" r="38" stroke="#4CAF50" stroke-width="4" fill="#E8F5E9"/>
          <path d="M25 40L35 50L55 30" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="font-size:24px;font-weight:600;margin-bottom:15px;color:#333;">Order Placed Successfully!</h2>
      <p style="font-size:16px;color:#666;margin-bottom:10px;">Thank you for your purchase</p>
      <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
        <p style="font-size:14px;color:#999;margin-bottom:5px;">Order ID</p>
        <p style="font-size:16px;font-weight:600;color:#333;font-family:monospace;">${orderId}</p>
      </div>
      <p style="font-size:14px;color:#666;margin-bottom:25px;">We'll send you an email confirmation shortly</p>
      <button id="close-popup-btn" style="background:#000;color:#fff;border:none;padding:12px 40px;border-radius:5px;cursor:pointer;font-size:15px;font-weight:500;">Continue Shopping</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close button handler
    document.getElementById('close-popup-btn').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  function showErrorPopup(message) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'order-error-popup';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = 'background:#fff;padding:40px;border-radius:10px;max-width:450px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.2);';
    
    popup.innerHTML = `
      <div style="margin-bottom:20px;">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;">
          <circle cx="40" cy="40" r="38" stroke="#f44336" stroke-width="4" fill="#ffebee"/>
          <path d="M30 30L50 50M50 30L30 50" stroke="#f44336" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 style="font-size:24px;font-weight:600;margin-bottom:15px;color:#333;">Order Failed</h2>
      <p style="font-size:16px;color:#666;margin-bottom:25px;">${message}</p>
      <button id="close-error-popup-btn" style="background:#f44336;color:#fff;border:none;padding:12px 40px;border-radius:5px;cursor:pointer;font-size:15px;font-weight:500;">Try Again</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close button handler
    document.getElementById('close-error-popup-btn').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  // Firebase function to save purchase history
  function savePurchaseToFirebase() {
    if (!window.db) {
      console.error('[FIREBASE] Firestore not initialized');
      showErrorPopup('Firebase is not configured. Please check your Firebase settings.');
      return;
    }

    if (cart.length === 0) {
      showErrorPopup('Your cart is empty!');
      return;
    }

    // Check if address is provided
    const savedAddress = localStorage.getItem('meelaUserAddress');
    if (!savedAddress) {
      showErrorPopup('Please add your delivery address before proceeding to payment.');
      return;
    }

    const addressData = JSON.parse(savedAddress);

    // Calculate total
    let total = 0;
    cart.forEach(function(item) {
      total += item.price * item.quantity;
    });

    // Generate a unique user ID (you can replace this with actual user authentication)
    let userId = localStorage.getItem('meelaUserId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('meelaUserId', userId);
    }

    // Prepare purchase data with address
    const purchaseData = {
      userId: userId,
      customerInfo: {
        name: addressData.name,
        email: addressData.email,
        phone: addressData.phone,
        address: addressData.address
      },
      items: cart.map(function(item) {
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          subtotal: item.price * item.quantity
        };
      }),
      total: total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      date: new Date().toISOString(),
      status: 'pending'
    };

    console.log('[FIREBASE] Saving purchase:', purchaseData);

    // Save to Firestore
    window.db.collection('purchaseHistory')
      .add(purchaseData)
      .then(function(docRef) {
        console.log('[FIREBASE] Purchase saved with ID:', docRef.id);
        
        // Clear cart after successful save
        cart = [];
        localStorage.setItem('meelaCart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        
        // Show success popup
        showSuccessPopup(docRef.id);
        
        // Close cart drawer
        const cartDrawer = document.getElementById('cart');
        if (cartDrawer) {
          cartDrawer.classList.remove('active');
          const cartAside = cartDrawer.querySelector('.slideover');
          if (cartAside) cartAside.classList.remove('active');
        }
      })
      .catch(function(error) {
        console.error('[FIREBASE] Error saving purchase:', error);
        showErrorPopup('Failed to process your order. Please try again.');
      });
  }

  function addToCart(quantity) {
    console.log('[CART-FIX] Adding', quantity, 'item(s)');
    
    const existingIndex = cart.findIndex(function(item) { return item.id === productData.id; });
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: productData.id,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('meelaCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    setTimeout(function() {
      openCartDrawer();
      var trigger = document.getElementById('cart-trigger');
      if (trigger) trigger.click();
    }, 50);
    
    console.log('[CART-FIX] Cart updated:', cart);
  }

  // Setup button click handler for BOTH forms
  function setupButtonHandler() {
    setTimeout(function() {
      console.log('[CART-FIX] Looking for Add to Cart button...');
      
      // Find the main product form (now the only form)
      const mainForm = document.querySelector('form[data-type="custom-cart-form"]') ||
                      document.querySelector('form#main-product-add-form');
      
      if (!mainForm) {
        console.error('[CART-FIX] Main product form not found!');
        return;
      }

      console.log('[CART-FIX] Found main product form');

      // Setup main form button
      const mainBtn = mainForm.querySelector('button[type="submit"]');
      if (mainBtn) {
        console.log('[CART-FIX] Setting up Add to Cart button');
        
        mainBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          console.log('[CART-FIX] *** ADD TO CART CLICKED ***');
          
          const qtyInput = mainForm.querySelector('input[type="number"][name="quantity"]') ||
                          mainForm.querySelector('input[id*="qty"]') ||
                          mainForm.querySelector('input.quantity__input');
          const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
          
          console.log('[CART-FIX] Quantity:', qty);
          addToCart(qty);
          
          return false;
        }, true);

        mainForm.onsubmit = function(e) {
          e.preventDefault();
          return false;
        };
      }

      console.log('[CART-FIX] Handler installed successfully');
    }, 800); // Wait for app.js to load
  }

  // Initialize
  function init() {
    console.log('[CART-FIX] Initializing...');
    updateCartCount();
    updateCartDisplay();
    setupButtonHandler();
    console.log('[CART-FIX] Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
