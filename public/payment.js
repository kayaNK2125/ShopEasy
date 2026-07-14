const cart = JSON.parse(localStorage.getItem('cart')) || [];
const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder')) || null;

// update cart count
document.querySelector('.cart-count').textContent = cart.reduce((s, i) => s + (i.qty || 1), 0);

// redirect to cart if no pending order
if (!pendingOrder && cart.length === 0) {
    window.location.href = 'cart.html';
}

// populate order summary on right panel
function loadSummary() {
    const list    = document.getElementById('pay-items-list');
    const total   = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
    const itemsHtml = cart.map(i => `
        <div class="summary-row">
            <span>${i.name} × ${i.qty || 1}</span>
            <span>₹${(i.price * (i.qty || 1)).toLocaleString('en-IN')}</span>
        </div>
    `).join('');

    list.innerHTML = itemsHtml;
    document.getElementById('pay-subtotal').textContent = total.toLocaleString('en-IN');
    document.getElementById('pay-total').textContent    = total.toLocaleString('en-IN');
}

loadSummary();

// switch payment method UI
function switchMethod(method) {
    ['cod', 'upi', 'card', 'netbanking'].forEach(m => {
        const opt     = document.getElementById(`opt-${m}`);
        const details = document.getElementById(`${m}-details`);
        if (opt) opt.classList.remove('selected');
        if (details) details.style.display = 'none';
    });

    const active = document.getElementById(`opt-${method}`);
    if (active) active.classList.add('selected');
    const detail = document.getElementById(`${method}-details`);
    if (detail) detail.style.display = 'block';
}

// auto-select COD on load
switchMethod('cod');

// format card number with spaces: 1234 5678 9012 3456
function formatCard(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = v.match(/.{1,4}/g)?.join(' ') || v;
}

// format expiry MM / YY
function formatExpiry(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
    input.value = v;
}

async function processPayment() {
    const method = document.querySelector('input[name="paymethod"]:checked').value;

    // validate method-specific fields
    if (method === 'upi') {
        const upiId = document.getElementById('upi-id').value.trim();
        if (!upiId || !upiId.includes('@')) {
            alert('Please enter a valid UPI ID (e.g. name@upi)');
            return;
        }
    }

    if (method === 'card') {
        const num  = document.getElementById('card-number').value.replace(/\s/g, '');
        const exp  = document.getElementById('card-expiry').value.trim();
        const cvv  = document.getElementById('card-cvv').value.trim();
        const name = document.getElementById('card-name').value.trim();
        if (num.length < 16 || !exp || cvv.length < 3 || !name) {
            alert('Please fill in all card details correctly.');
            return;
        }
    }

    const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
    const orderId = 'SE' + Date.now().toString().slice(-8);

    const order = {
        id: Date.now(),
        items: cart,
        total,
        status: 'confirmed',
        paymentMethod: method,
        ...(pendingOrder?.deliveryAddress && { deliveryAddress: pendingOrder.deliveryAddress })
    };

    // save order to MongoDB
    try {
        await fetch('/addorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
    } catch (e) {
        console.log('Order save failed but continuing:', e);
    }

    // clear cart and pending order
    localStorage.removeItem('cart');
    localStorage.removeItem('pendingOrder');

    // show success screen
    showSuccess(orderId, method, total);
}

function showSuccess(orderId, method, total) {
    document.getElementById('payment-page').style.display  = 'none';
    document.getElementById('success-screen').style.display = 'flex';

    document.getElementById('order-id-display').textContent = orderId;
    document.getElementById('success-amount').textContent   = '₹' + total.toLocaleString('en-IN');

    const methodLabels = { cod: 'Cash on Delivery', upi: 'UPI', card: 'Credit / Debit Card', netbanking: 'Net Banking' };
    document.getElementById('success-method').textContent = methodLabels[method] || method;

    // countdown and redirect
    let count = 3;
    const timer = setInterval(() => {
        count--;
        const el = document.getElementById('countdown');
        if (el) el.textContent = count;
        if (count <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html';
        }
    }, 1000);
}
