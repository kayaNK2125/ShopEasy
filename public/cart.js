const cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        cartDiv.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
        total += item.price;
    });
    
    document.getElementById('total-price').textContent = total;
}

function removeItem(productId) {
    const index = cart.findIndex(item => item.id === productId);
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function placeOrder() {
    if(cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

loadCart();