// load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// update navbar cart count (sum of quantities)
function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.querySelector('.cart-count').textContent = total;
}
updateCartCount();

function loadCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        cartDiv.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products and come back!</p>
                <a href="index.html"><button class="hero-btn" style="margin-top:1.5rem">Continue Shopping</button></a>
            </div>
        `;
        document.getElementById('total-price').textContent = '0';
        document.getElementById('item-count').textContent = '0 items';
        const ds = document.getElementById('delivery-section');
        if (ds) ds.style.display = 'none';
        return;
    }

    // show delivery address form when cart has items
    const ds = document.getElementById('delivery-section');
    if (ds) ds.style.display = 'block';

    cart.forEach((item, index) => {
        const qty = item.qty || 1;
        const subtotal = item.price * qty;

        cartDiv.innerHTML += `
            <div class="cart-item" style="animation-delay:${index * 0.07}s">
                <div class="cart-item-img">
                    <img src="${item.image || ''}" alt="${item.name}" onerror="this.style.display='none'">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</p>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button onclick="changeQty(${item.id}, -1)">−</button>
                        <span>${qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                    <p class="cart-item-subtotal">₹${subtotal.toLocaleString('en-IN')}</p>
                    <button class="remove-btn" onclick="removeItem(${item.id})">✕ Remove</button>
                </div>
            </div>
        `;
    });

    updateSummary();
}

function updateSummary() {
    const totalQty   = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

    document.getElementById('item-count').textContent  = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
    document.getElementById('total-price').textContent = totalPrice.toLocaleString('en-IN');
    updateCartCount();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty = (item.qty || 1) + delta;
    if (item.qty < 1) {
        removeItem(productId);
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // validate delivery address
    const name    = document.getElementById('del-name')?.value.trim();
    const phone   = document.getElementById('del-phone')?.value.trim();
    const address = document.getElementById('del-address')?.value.trim();
    const city    = document.getElementById('del-city')?.value.trim();
    const pincode = document.getElementById('del-pincode')?.value.trim();
    const state   = document.getElementById('del-state')?.value;

    if (!name || !phone || !address || !city || !pincode || !state) {
        alert('Please fill in your complete delivery address before placing the order.');
        document.getElementById('delivery-section').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (phone.length < 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    if (pincode.length !== 6) {
        alert('Please enter a valid 6-digit PIN code.');
        return;
    }

    // save address temporarily, payment.js will finalize the order
    localStorage.setItem('pendingOrder', JSON.stringify({
        deliveryAddress: { name, phone, address, city, pincode, state }
    }));

    window.location.href = 'payment.html';
}

loadCart();
