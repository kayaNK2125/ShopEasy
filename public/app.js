// global state
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// update cart count badge on page load (sum of all quantities)
document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

// maps category name to CSS class (for colored top border on cards)
const categoryClass = {
    'fashion':     'fashion-card',
    'electronics': 'electronics-card',
    'wireless':    'wireless-card'
};

// fetch all products from backend and display them
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.log('Error loading products:', error);
    }
}

// render products into the grid with category accent + staggered animation
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:3rem; grid-column:1/-1; color:#888;">No products found.</p>';
        return;
    }

    products.forEach((product, index) => {
        // escape single quotes so onclick doesn't break
        const safeName = product.name.replace(/'/g, "\\'");
        const desc     = product.description ? product.description.substring(0, 65) + '...' : '';
        const rating   = product.rating ? `<div class="product-rating">⭐ ${product.rating}</div>` : '';
        const stock    = product.stock  ? `<p class="product-stock">In Stock: ${product.stock}</p>` : '';
        const cls      = categoryClass[product.category] || '';

        grid.innerHTML += `
            <div class="product-card ${cls}" style="animation-delay: ${index * 0.08}s">
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

// filter by category - highlights the nav button that was clicked
function filterProducts(category, clickedBtn) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
}

// called from category section cards - filters and smooth-scrolls to products
function filterCategory(category) {
    filterProducts(category, null);
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
}

// real-time search - filters by name, description, or category as user types
function searchProducts(query) {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.style.display = query.length > 0 ? 'inline' : 'none';

    if (!query.trim()) {
        displayProducts(allProducts);
        return;
    }

    const q = query.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
    displayProducts(filtered);
}

// clear the search input and restore full product list
function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('clear-btn').style.display = 'none';
    displayProducts(allProducts);
}

// "View All" button - resets any active filter or search and shows everything
function showAllProducts() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    displayProducts(allProducts);
}

// add product to cart — increments qty if already present
function addToCart(productId, productName, productPrice) {
    const product = allProducts.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: product ? product.image : ''
        });
        cart[cart.length - 1].qty = 1;
    }

    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.querySelector('.cart-count').textContent = totalQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${productName} added to cart`);
}

// toast notification — replaces alert()
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

loadProducts();

// theme toggle lives in theme.js — loaded on all pages
