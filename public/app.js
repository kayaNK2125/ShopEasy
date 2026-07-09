// Fetch products from our Express API and display them
async function loadProducts() {
   try{ 
    const response = await fetch('http://localhost:3000/products'); //inject
     const products = await response.json(); //conversion storing
 const grid = document.getElementById('products-grid'); //attach with id
        grid.innerHTML = ''; //clear

        products.forEach(product => {
            grid.innerHTML += `
                <div class="product-card">
                    <div class="product-img">🛍️</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                 <button class="add-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                </div>
            `;
        });
    }
     catch(error){
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
   
  // Load products when page opens
loadProducts();  

