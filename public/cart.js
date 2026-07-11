// load cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// update navbar cart count badge
document.querySelector('.cart-count').textContent = cart.length;

function loadCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    
    let total = 0;
    
    // if cart is empty show message
    if(cart.length === 0) {
        cartDiv.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty!</p>';
        document.getElementById('total-price').textContent = 0;
        return;
    }
    
    // loop through cart items and display each one
    cart.forEach(item => {
        cartDiv.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
        total += item.price; // add each item price to total
    });
    
    document.getElementById('total-price').textContent = total;
}

function removeItem(productId) {
    // find index of item to remove
    const index = cart.findIndex(item => item.id === productId);
    cart.splice(index, 1); // remove 1 item at that index
    localStorage.setItem('cart', JSON.stringify(cart)); // update localStorage
    loadCart(); // reload cart display
}

async function placeOrder() {
    if(cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const order = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: "pending"
    };

    try {
        await fetch('http://localhost:3000/addorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
    } catch(error) {
        console.log('Order save failed but continuing:', error);
    }

    // redirect happens regardless
    localStorage.removeItem('cart');
    alert('Order placed successfully! 🎉');
    window.location.href = 'index.html';
}
loadCart();