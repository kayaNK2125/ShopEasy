// global variables at top
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// update cart count on page load
document.querySelector('.cart-count').textContent = cart.length;

// fetch products from our own backend
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch(error) {
        console.log('Error loading products:', error);
    }
}

// display products in grid
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:3rem; grid-column:1/-1; color:#888;">No products found.</p>';
        return;
    }

    products.forEach(product => {
        // escape single quotes in name so onclick doesn't break
        const safeName = product.name.replace(/'/g, "\\'");
        const desc = product.description ? product.description.substring(0, 65) + '...' : '';
        const rating = product.rating ? `<div class="product-rating">⭐ ${product.rating}</div>` : '';
        const stock = product.stock ? `<p class="product-stock">In Stock: ${product.stock}</p>` : '';

        grid.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${desc}</p>
                ${rating}
                ${stock}
                <p class="product-price">₹${product.price}</p>
                <button class="add-cart-btn" onclick="addToCart(${product.id}, '${safeName}', ${product.price})">Add to Cart</button>
            </div>
        `;
    });
}

// filter products by category (filters local array - no extra API call needed)
function filterProducts(category, clickedBtn) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);

    // highlight the active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
}

// add item to cart
function addToCart(productId, productName, productPrice) {
    cart.push({ id: productId, name: productName, price: productPrice });
    document.querySelector('.cart-count').textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} added to cart!`);
}

loadProducts();
