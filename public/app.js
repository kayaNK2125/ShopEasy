async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        allProducts = await response.json(); // save to global variable
        displayProducts(allProducts); // display all on load
    } catch(error) {
        console.log('Error loading products:', error);
    }
} 

    let cart = [];

    function addToCart(productId, productName, productPrice) {
    cart.push({ id: productId, name: productName, price: productPrice });
    const count = document.querySelector('.cart-count');
    count.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} cart mein add ho gaya!`);
}

// store all products globally so we can filter without fetching again
let allProducts = [];

// filter products by category
function filterProducts(category) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
}

// separate display function so both load and filter can use it
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-img">${product.emoji || '🛍️'}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <button class="add-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;
    });
}
   
  // Load products when page opens
loadProducts();  

