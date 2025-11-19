// Admin panel script
(function(){
  'use strict';
  console.log('[ADMIN] Loading...');

  // Initialize Firebase
  if (!window.firebase || !firebase.apps) {
    console.warn('[ADMIN] Firebase SDK not found on page. Make sure the firebase scripts are loaded.');
  }

  // Toggle delivered state for an order (Firestore or localStorage)
  async function toggleDelivered(id, newVal, tr, statusBtn) {
    if (!id) return alert('Order id missing');
    // Update in Firestore if available
    if (db) {
      try {
        await db.collection('purchaseHistory').doc(id).update({ delivered: newVal });
      } catch (err) {
        console.error('[ADMIN] toggleDelivered error', err);
        alert('Failed to update order status: ' + (err.message || err));
        return;
      }
    } else {
      // localStorage fallback
      try {
        const history = JSON.parse(localStorage.getItem('meelaCartHistory')||'[]');
        const idx = history.findIndex(h => (h.id||'') === id);
        if (idx !== -1) {
          history[idx].delivered = newVal;
          localStorage.setItem('meelaCartHistory', JSON.stringify(history));
        }
      } catch (e) {
        console.error('[ADMIN] local toggleDelivered failed', e);
      }
    }

    // Update UI (status button)
    statusBtn.dataset.delivered = newVal ? 'true' : 'false';
    statusBtn.textContent = newVal ? 'Delivered' : 'Mark Delivered';
    statusBtn.className = newVal ? 'btn btn-success btn-status' : 'btn btn-secondary btn-status';
  }

  // Delete an order (Firestore or localStorage) and remove row from DOM
  async function deleteOrder(id, tr) {
    if (!id) return alert('Order id missing');
    // Delete from Firestore if available
    if (db) {
      try {
        await db.collection('purchaseHistory').doc(id).delete();
      } catch (err) {
        console.error('[ADMIN] deleteOrder error', err);
        alert('Failed to delete order: ' + (err.message || err));
        return;
      }
    } else {
      // localStorage fallback
      try {
        const history = JSON.parse(localStorage.getItem('meelaCartHistory')||'[]');
        const newHistory = history.filter(h => (h.id||'') !== id);
        localStorage.setItem('meelaCartHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.error('[ADMIN] local deleteOrder failed', e);
      }
    }

    // Remove row from DOM and update count
    if (tr && tr.parentNode) tr.parentNode.removeChild(tr);
    // update visible order count
    try {
      const current = parseInt((orderCount && orderCount.textContent) ? orderCount.textContent.replace(/[^0-9]/g,'') : ordersTbody.rows.length);
      const next = Math.max(0, (isNaN(current) ? ordersTbody.rows.length : current - 1));
      if (orderCount) orderCount.textContent = next + ' order' + (next !== 1 ? 's' : '');
    } catch (e) { /* ignore */ }
  }

  // Basic references
  const appSection = document.getElementById('app');
  const ordersTbody = document.getElementById('orders-tbody');
  const searchInput = document.getElementById('search-input');
  const closeBtn = document.getElementById('close-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const orderCount = document.getElementById('order-count');

  let db = window.db || null;
  if (!db && window.firebase && firebase.apps && firebase.apps.length > 0) {
    try { db = firebase.firestore(); window.db = db; console.log('[ADMIN] Firestore initialized'); } catch (e) { console.warn('[ADMIN] Firestore init failed', e); }
  }
  
  // Close button redirects to index.html
  closeBtn.addEventListener('click', function() {
    window.location.href = 'index.htm';
  });

  // Build table row
  function buildRow(doc) {
    const data = doc.data ? doc.data() : (doc.data || {});
    const tr = document.createElement('tr');
    
    // Order ID - use custom orderId if available, fallback to doc.id
    const idCell = document.createElement('td');
    const displayId = data.orderId || doc.id;
    idCell.textContent = displayId.length > 15 ? displayId.substring(0, 15) + '...' : displayId;
    idCell.style.fontFamily = 'monospace';
    idCell.style.fontSize = '13px';
    idCell.title = displayId;
    
    // Customer Name
    const nameCell = document.createElement('td');
    nameCell.textContent = (data.customerInfo && data.customerInfo.name) || '-';
    
    // Email
    const emailCell = document.createElement('td');
    emailCell.textContent = (data.customerInfo && data.customerInfo.email) || '-';
    emailCell.style.fontSize = '13px';
    
    // Phone
    const phoneCell = document.createElement('td');
    const phoneVal = (data.customerInfo && data.customerInfo.phone) || '-';
    phoneCell.textContent = phoneVal;
    phoneCell.className = 'phone-cell';
    phoneCell.title = phoneVal;
    
    // Total
    const totalCell = document.createElement('td');
    totalCell.textContent = data.total ? 'AED ' + (data.total.toFixed?data.total.toFixed(2):data.total) : '-';
    totalCell.style.fontWeight = '600';
    
    // Date
    const dateCell = document.createElement('td');
    // Try multiple possible timestamp fields
    const dateValue = data.date || data.timestamp || data.createdAt || data.orderDate;
    if (dateValue) {
      let date;
      // Handle Firestore Timestamp
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      } else if (dateValue.seconds) {
        // Firestore Timestamp object
        date = new Date(dateValue.seconds * 1000);
      } else {
        date = new Date(dateValue);
      }
      dateCell.textContent = date.toLocaleDateString('en-IN');
      dateCell.title = date.toLocaleString('en-IN');
    } else {
      dateCell.textContent = '-';
    }
    dateCell.style.fontSize = '13px';
    
    // Status (button placed in this column)
    const statusCell = document.createElement('td');
    const isDelivered = !!data.delivered;
    const statusBtn = document.createElement('button');
    statusBtn.textContent = isDelivered ? 'Delivered' : 'Mark Delivered';
    statusBtn.className = isDelivered ? 'btn btn-success btn-status' : 'btn btn-secondary btn-status';
    statusBtn.dataset.delivered = isDelivered ? 'true' : 'false';
    statusBtn.addEventListener('click', function(e){
      e.preventDefault();
      const current = statusBtn.dataset.delivered === 'true';
      const newVal = !current;
      toggleDelivered(doc.id || '', newVal, tr, statusBtn);
    });
    statusCell.appendChild(statusBtn);

    // Action (buttons)
    const actionCell = document.createElement('td');
    actionCell.style.whiteSpace = 'nowrap';
    const actionWrap = document.createElement('div');
    actionWrap.className = 'action-buttons';

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View Details';
    viewBtn.className = 'btn btn-ghost btn-action';
    viewBtn.addEventListener('click', function(){ showOrderModal(doc.id || '', data); });
    actionWrap.appendChild(viewBtn);

    // Delete button

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn btn-danger btn-delete';
    deleteBtn.style.marginLeft = '8px';
    deleteBtn.addEventListener('click', function(e){
      e.preventDefault();
      if (confirm('Delete this order? This action cannot be undone.')) {
        deleteOrder(doc.id || '', tr);
      }
    });
    actionWrap.appendChild(deleteBtn);
    actionCell.appendChild(actionWrap);

    tr.appendChild(idCell);
    tr.appendChild(nameCell);
    tr.appendChild(emailCell);
    tr.appendChild(phoneCell);
    tr.appendChild(totalCell);
    tr.appendChild(dateCell);
    tr.appendChild(statusCell);
    tr.appendChild(actionCell);

    return tr;
  }

  // Render orders
  function renderOrders(docs) {
    ordersTbody.innerHTML = '';
    if (!docs || docs.length === 0) {
      ordersTbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>No orders found</div>
          </td>
        </tr>
      `;
      if (orderCount) orderCount.textContent = '0 orders';
      return;
    }

    docs.forEach(doc => {
      ordersTbody.appendChild(buildRow(doc));
    });
    
    if (orderCount) orderCount.textContent = docs.length + ' order' + (docs.length !== 1 ? 's' : '');
  }
  // Fetch orders from Firestore or localStorage
  async function fetchAndRenderOrders(){
    console.log('[ADMIN] Fetching orders...');
    console.log('[ADMIN] Database available:', !!db);
    
    if (db) {
      try {
        console.log('[ADMIN] Querying purchaseHistory collection...');
        const snapshot = await db.collection('purchaseHistory').orderBy('timestamp','desc').limit(500).get();
        console.log('[ADMIN] Query successful. Documents found:', snapshot.docs.length);
        
        if (snapshot.empty) {
          console.log('[ADMIN] No documents in purchaseHistory collection');
          // Check if there are any documents without timestamp ordering
          const fallbackSnapshot = await db.collection('purchaseHistory').limit(10).get();
          console.log('[ADMIN] Fallback query (no ordering):', fallbackSnapshot.docs.length, 'documents');
          
          if (!fallbackSnapshot.empty) {
            console.log('[ADMIN] Found documents without timestamp ordering, rendering those...');
            renderOrders(fallbackSnapshot.docs);
            return;
          }
        }
        
        renderOrders(snapshot.docs);
      } catch (err) {
        console.error('[ADMIN] Fetch error:', err);
        console.error('[ADMIN] Error code:', err.code);
        console.error('[ADMIN] Error message:', err.message);
        
        // If the error is about missing index, try without orderBy
        if (err.code === 'failed-precondition' || err.message.includes('index')) {
          console.log('[ADMIN] Trying query without orderBy...');
          try {
            const snapshot = await db.collection('purchaseHistory').limit(500).get();
            console.log('[ADMIN] Query without orderBy successful:', snapshot.docs.length, 'documents');
            renderOrders(snapshot.docs);
            return;
          } catch (err2) {
            console.error('[ADMIN] Fallback query also failed:', err2);
          }
        }
        
        // Fallback to localStorage if Firestore fails
        console.log('[ADMIN] Falling back to localStorage...');
        loadFromLocalStorage();
      }
    } else {
      console.log('[ADMIN] No database connection, using localStorage');
      // No Firebase - use localStorage
      loadFromLocalStorage();
    }
  }
  
  function loadFromLocalStorage() {
    const history = JSON.parse(localStorage.getItem('meelaCartHistory')||'[]');
    const docs = history.map((h, i) => ({ id: h.id||('local_'+i), data:()=>h }));
    renderOrders(docs);
  }

  // Modal: show order details
  function showOrderModal(id, data) {
    const html = [];
    
    // Order Info Section
    html.push('<div class="detail-section">');
    html.push('<h3>Order Information</h3>');
    html.push('<div class="detail-row">');
    html.push('<span class="detail-label">Order ID:</span>');
    html.push('<span class="detail-value" style="font-family:monospace">' + escapeHtml(data.orderId || id) + '</span>');
    html.push('</div>');
    html.push('<div class="detail-row">');
    html.push('<span class="detail-label">Date:</span>');
    html.push('<span class="detail-value">' + (data.date ? new Date(data.date).toLocaleString('en-IN') : '-') + '</span>');
    html.push('</div>');
    html.push('</div>');
    
    // Customer Info Section
    if (data.customerInfo) {
      html.push('<div class="detail-section">');
      html.push('<h3>Customer Details</h3>');
      html.push('<div class="detail-row">');
      html.push('<span class="detail-label">Name:</span>');
      html.push('<span class="detail-value">' + escapeHtml(data.customerInfo.name || '-') + '</span>');
      html.push('</div>');
      html.push('<div class="detail-row">');
      html.push('<span class="detail-label">Email:</span>');
      html.push('<span class="detail-value">' + escapeHtml(data.customerInfo.email || '-') + '</span>');
      html.push('</div>');
      html.push('<div class="detail-row">');
      html.push('<span class="detail-label">Phone:</span>');
      html.push('<span class="detail-value">' + escapeHtml(data.customerInfo.phone || '-') + '</span>');
      html.push('</div>');
      html.push('<div class="detail-row">');
      html.push('<span class="detail-label">Address:</span>');
      html.push('<span class="detail-value">' + escapeHtml(data.customerInfo.address || '-') + '</span>');
      html.push('</div>');
      html.push('</div>');
    }
    
    // Items Section
    html.push('<div class="detail-section">');
    html.push('<h3>Order Items</h3>');
    html.push('<table class="items-table">');
    html.push('<thead><tr><th>Product</th><th>Price</th><th>Qty</th><th style="text-align:right">Subtotal</th></tr></thead>');
    html.push('<tbody>');
    
    let total = 0;
    (data.items || []).forEach(item => {
      const subtotal = item.subtotal || (item.price * item.quantity);
      total += subtotal;
      html.push('<tr>');
      html.push('<td>' + escapeHtml(item.title || '') + '</td>');
      html.push('<td>AED ' + (item.price ? item.price.toFixed(2) : '0.00') + '</td>');
      html.push('<td>' + escapeHtml(String(item.quantity || 1)) + '</td>');
      html.push('<td style="text-align:right">AED ' + (subtotal.toFixed ? subtotal.toFixed(2) : subtotal) + '</td>');
      html.push('</tr>');
    });
    
    // Show subtotal row
    html.push('<tr>');
    html.push('<td colspan="3" style="text-align:right">Subtotal:</td>');
    html.push('<td style="text-align:right">AED ' + (data.subtotal ? data.subtotal.toFixed(2) : total.toFixed(2)) + '</td>');
    html.push('</tr>');
    
    // Show discount if applicable
    if (data.discount && data.discount > 0) {
      html.push('<tr style="color:#27ae60">');
      html.push('<td colspan="3" style="text-align:right">Discount (20%):</td>');
      html.push('<td style="text-align:right">-AED ' + data.discount.toFixed(2) + '</td>');
      html.push('</tr>');
    }
    
    // Show total
    html.push('<tr class="total-row">');
    html.push('<td colspan="3" style="text-align:right;font-weight:600">Total:</td>');
    html.push('<td style="text-align:right;font-weight:600">AED ' + (data.total ? data.total.toFixed(2) : total.toFixed(2)) + '</td>');
    html.push('</tr>');
    html.push('</tbody></table>');
    html.push('</div>');

    modalBody.innerHTML = html.join('');
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }
  
  // Close modal on button click or overlay click
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });

  function escapeHtml(str){
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; });
  }

  // Wire up search/filter
  searchInput.addEventListener('input', applyFilters);
  
  closeBtn.addEventListener('click', () => {
    window.location.href = 'index.htm';
  });

  function applyFilters(){
    const q = (searchInput.value||'').toLowerCase().trim();
    
    if (db) {
      // Fetch from Firestore and filter client-side
      (async ()=>{
        try {
          const snapshot = await db.collection('purchaseHistory').orderBy('timestamp','desc').limit(500).get();
          let docs = snapshot.docs;
          if (q) {
            docs = docs.filter(d => {
              const data = d.data();
              return (d.id||'').toLowerCase().includes(q) || 
                     (data.customerInfo && (
                       (data.customerInfo.name||'').toLowerCase().includes(q) || 
                       (data.customerInfo.email||'').toLowerCase().includes(q) || 
                       (data.customerInfo.phone||'').toLowerCase().includes(q)
                     ));
            });
          }
          renderOrders(docs);
        } catch (e) { 
          console.error('[ADMIN] filter error', e); 
        }
      })();
    } else {
      // Filter localStorage data
      const history = JSON.parse(localStorage.getItem('meelaCartHistory')||'[]');
      let docs = history.map((h,i)=>({ id:h.id||('local_'+i), data:()=>h }));
      if (q) {
        docs = docs.filter(d => {
          const data = d.data();
          return (d.id||'').toLowerCase().includes(q) || 
                 (data.customerInfo && (
                   (data.customerInfo.name||'').toLowerCase().includes(q) || 
                   (data.customerInfo.email||'').toLowerCase().includes(q) || 
                   (data.customerInfo.phone||'').toLowerCase().includes(q)
                 ));
        });
      }
      renderOrders(docs);
    }
  }

  // ==================== IMAGE UPLOAD FUNCTIONALITY (CLOUDINARY) ====================
  
  // Cloudinary Configuration
  const CLOUDINARY_CLOUD_NAME = 'dpva1nkk0'; // Replace with your Cloudinary cloud name
  const CLOUDINARY_UPLOAD_PRESET = 'meela_products'; // Using Cloudinary's default unsigned preset for testing
  
  const uploadBtn = document.getElementById('upload-image-btn');
  const uploadModalOverlay = document.getElementById('upload-modal-overlay');
  const uploadModalCloseBtn = document.getElementById('upload-modal-close-btn');
  const uploadCancelBtn = document.getElementById('upload-cancel-btn');
  const uploadForm = document.getElementById('upload-form');
  const imageFileInput = document.getElementById('image-file');
  const imageTitleInput = document.getElementById('image-title');
  const imagePreview = document.getElementById('image-preview');
  const previewImg = document.getElementById('preview-img');
  const uploadProgress = document.getElementById('upload-progress');
  const progressBar = document.getElementById('progress-bar');
  const uploadStatus = document.getElementById('upload-status');
  const imageGallery = document.getElementById('image-gallery');

  console.log('[ADMIN] Cloudinary upload ready');

  // Open upload modal
  uploadBtn.addEventListener('click', function() {
    uploadModalOverlay.classList.add('active');
    uploadForm.reset();
    imagePreview.style.display = 'none';
    uploadProgress.style.display = 'none';
  });

  // Close upload modal
  uploadModalCloseBtn.addEventListener('click', function() {
    uploadModalOverlay.classList.remove('active');
  });

  uploadCancelBtn.addEventListener('click', function() {
    uploadModalOverlay.classList.remove('active');
  });

  uploadModalOverlay.addEventListener('click', function(e) {
    if (e.target === uploadModalOverlay) {
      uploadModalOverlay.classList.remove('active');
    }
  });

  // Preview image
  imageFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Upload image
  uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('[UPLOAD] Starting Cloudinary upload process...');
    
    const file = imageFileInput.files[0];
    const title = imageTitleInput.value.trim();

    if (!file || !title) {
      alert('Please fill all fields');
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
      alert('Please configure your Cloudinary credentials in admin.js');
      console.error('[UPLOAD] Cloudinary not configured');
      return;
    }

    console.log('[UPLOAD] File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('[UPLOAD] Title:', title);
    console.log('[UPLOAD] Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('[UPLOAD] Upload Preset:', CLOUDINARY_UPLOAD_PRESET);

    // Show progress
    uploadProgress.style.display = 'block';
    progressBar.style.width = '0%';
    uploadStatus.textContent = 'Uploading to Cloudinary...';
    uploadStatus.style.color = '#3c3c3c';

    try {
      // Create form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      // Removed folder parameter - it can cause issues with unsigned presets
      // You can set the folder in the preset settings instead

      // Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      console.log('[UPLOAD] Uploading to:', cloudinaryUrl);
      console.log('[UPLOAD] FormData contents: file +', CLOUDINARY_UPLOAD_PRESET);
      
      progressBar.style.width = '30%';
      uploadStatus.textContent = 'Uploading... 30%';

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });

      console.log('[UPLOAD] Response status:', response.status);
      console.log('[UPLOAD] Response ok:', response.ok);

      // Get response text first to log it
      const responseText = await response.text();
      console.log('[UPLOAD] Response body:', responseText);

      if (!response.ok) {
        let errorMsg = `Cloudinary upload failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error && errorData.error.message) {
            errorMsg += `\n${errorData.error.message}`;
          }
          console.error('[UPLOAD] Error details:', errorData);
        } catch (e) {
          console.error('[UPLOAD] Could not parse error response');
        }
        throw new Error(errorMsg);
      }

      const data = JSON.parse(responseText);
      console.log('[UPLOAD] Cloudinary response:', data);

      progressBar.style.width = '70%';
      uploadStatus.textContent = 'Saving to database... 70%';

      // Save image metadata to Firestore
      if (window.db) {
        await window.db.collection('productImages').add({
          title: title,
          cloudinaryPublicId: data.public_id,
          url: data.secure_url,
          thumbnailUrl: data.thumbnail_url || data.secure_url,
          format: data.format,
          width: data.width,
          height: data.height,
          size: data.bytes,
          uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
          uploadedBy: 'admin'
        });
        console.log('[UPLOAD] Metadata saved to Firestore');
      }

      progressBar.style.width = '100%';
      uploadStatus.textContent = 'Upload successful!';
      uploadStatus.style.color = '#4caf50';

      console.log('[UPLOAD] Upload complete:', data.secure_url);
      
      // Close modal after success
      setTimeout(() => {
        uploadModalOverlay.classList.remove('active');
        loadImageGallery(); // Refresh gallery if exists
        alert(`Image uploaded successfully!\n\nURL: ${data.secure_url}\n\nYou can use this URL in your products.`);
      }, 1500);

    } catch (error) {
      console.error('[UPLOAD] Error:', error);
      uploadStatus.textContent = 'Upload failed: ' + error.message;
      uploadStatus.style.color = '#f44336';
      progressBar.style.width = '0%';
      alert('Upload failed: ' + error.message);
    }
  });

  // Load and display images (Cloudinary)
  function loadImageGallery() {
    if (!db) return;

    db.collection('productImages')
      .orderBy('uploadedAt', 'desc')
      .get()
      .then(function(snapshot) {
        if (!imageGallery) return;
        
        imageGallery.innerHTML = '';
        
        if (snapshot.empty) {
          imageGallery.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#939393;padding:40px">No images uploaded yet</div>';
          return;
        }

        snapshot.forEach(function(doc) {
          const data = doc.data();
          const imageCard = document.createElement('div');
          imageCard.style.cssText = 'border:1px solid #dedfdb;background:#fff;overflow:hidden;position:relative';
          
          imageCard.innerHTML = `
            <img src="${data.url}" alt="${data.title}" style="width:100%;height:200px;object-fit:cover;display:block">
            <div style="padding:12px">
              <p style="margin:0 0 8px;font-weight:500;font-size:14px;color:#3c3c3c">${escapeHtml(data.title)}</p>
              <p style="margin:0;font-size:12px;color:#939393">${data.uploadedAt ? new Date(data.uploadedAt.toDate()).toLocaleDateString('en-IN') : 'Just now'}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#939393;word-break:break-all">${data.cloudinaryPublicId || 'N/A'}</p>
              <div style="margin-top:12px;display:flex;gap:8px">
                <button class="copy-url-btn" data-url="${data.url}" style="flex:1;padding:8px;background:#000;color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:500">Copy URL</button>
                <button class="delete-img-btn" data-id="${doc.id}" data-public-id="${data.cloudinaryPublicId}" style="flex:1;padding:8px;background:#dc2626;color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:500">Delete</button>
              </div>
            </div>
          `;
          
          imageGallery.appendChild(imageCard);
        });

        // Add event listeners for copy and delete buttons
        document.querySelectorAll('.copy-url-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            navigator.clipboard.writeText(url).then(function() {
              alert('Image URL copied to clipboard!');
            });
          });
        });

        document.querySelectorAll('.delete-img-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const imageId = this.getAttribute('data-id');
            const publicId = this.getAttribute('data-public-id');
            
            if (confirm('Are you sure you want to delete this image from Cloudinary and database?')) {
              deleteCloudinaryImage(imageId, publicId);
            }
          });
        });
      })
      .catch(function(error) {
        console.error('Error loading images:', error);
        if (imageGallery) {
          imageGallery.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#dc2626;padding:40px">Error loading images</div>';
        }
      });
  }

  // Delete image from Cloudinary and Firestore
  async function deleteCloudinaryImage(imageId, publicId) {
    if (!db) return;

    try {
      // Note: Deleting from Cloudinary requires signed requests with API secret
      // For security, deletion should be done via backend/server
      // For now, we'll only delete from Firestore
      
      console.log('[DELETE] Deleting image from database:', imageId);
      
      await db.collection('productImages').doc(imageId).delete();
      
      alert('Image record deleted from database.\n\nNote: To delete from Cloudinary, you need to:\n1. Use Cloudinary dashboard, OR\n2. Implement server-side deletion with API secret');
      
      loadImageGallery();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image: ' + error.message);
    }
  }

  // Add Test Order function for debugging
  window.addTestOrder = function() {
    if (!db) {
      alert('Database not connected');
      return;
    }
    
    const testOrder = {
      orderId: 'TEST_' + Date.now(),
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+971501234567',
        address: 'Dubai, UAE'
      },
      items: [
        {
          title: 'Meela Hair Growth Oil',
          price: 699,
          quantity: 1,
          subtotal: 699
        }
      ],
      total: 699,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      date: new Date().toISOString()
    };
    
    db.collection('purchaseHistory').add(testOrder)
      .then(function() {
        alert('Test order added successfully! Refresh the page to see it.');
        console.log('[TEST] Order added:', testOrder);
      })
      .catch(function(error) {
        alert('Failed to add test order: ' + error.message);
        console.error('[TEST] Error:', error);
      });
  };
  
  console.log('[ADMIN] To add a test order, run: window.addTestOrder()');

  // Initialize
  fetchAndRenderOrders();
  if (imageGallery) {
    loadImageGallery();
  }
})();