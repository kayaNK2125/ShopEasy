// load cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

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

    // build order object
    const order = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: "pending"
    };

    // send order to backend
    await fetch('http://localhost:3000/addorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

    alert('Order placed successfully!');
    localStorage.removeItem('cart'); // clear cart
    window.location.href = 'index.html'; // go back home
}

loadCart();