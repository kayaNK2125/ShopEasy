// run once: node add-products.js
// adds 12 more products to MongoDB so filters show more results

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected'))
    .catch(err => { console.log(err); process.exit(1); });

const Product = mongoose.model('Product', new mongoose.Schema({
    id: Number, name: String, price: Number, category: String,
    description: String, rating: Number, stock: Number, image: String
}));

const newProducts = [
    // FASHION (6 more)
    { id: 9,  name: 'Slim Fit Chinos', price: 1299, category: 'fashion', description: 'Comfortable slim-fit chinos perfect for casual and semi-formal occasions.', rating: 4.3, stock: 45, image: 'https://cdn.dummyjson.com/product-images/mens-shirts/black-&-white-stripe-shirt/thumbnail.webp' },
    { id: 10, name: 'Denim Jacket', price: 2199, category: 'fashion', description: 'Classic blue denim jacket with double-chest pockets. A wardrobe essential.', rating: 4.5, stock: 20, image: 'https://cdn.dummyjson.com/product-images/mens-shirts/man-long-sleeve-shirt/thumbnail.webp' },
    { id: 11, name: 'Sports Sneakers', price: 3499, category: 'fashion', description: 'Lightweight running shoes with cushioned sole and breathable mesh upper.', rating: 4.4, stock: 35, image: 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp' },
    { id: 12, name: 'Aviator Sunglasses', price: 899, category: 'fashion', description: 'UV400 polarized aviator sunglasses with metal frame. Classic style.', rating: 4.2, stock: 60, image: 'https://cdn.dummyjson.com/product-images/sunglasses/sunglasses-eyewear/thumbnail.webp' },
    { id: 13, name: 'Casual Polo Shirt', price: 699, category: 'fashion', description: 'Cotton blend polo shirt available in multiple colors. Breathable and comfortable.', rating: 4.1, stock: 80, image: 'https://cdn.dummyjson.com/product-images/tops/black-&-white-stripe-top/thumbnail.webp' },
    { id: 14, name: 'Silver Bracelet', price: 1199, category: 'fashion', description: 'Elegant silver-plated bracelet with minimalist design. Great as a gift.', rating: 4.3, stock: 25, image: 'https://cdn.dummyjson.com/product-images/mens-watches/silver-ring-watch/thumbnail.webp' },

    // ELECTRONICS (4 more)
    { id: 15, name: 'Samsung Galaxy S23', price: 74999, category: 'electronics', description: 'Samsung Galaxy S23 with 200MP camera, Snapdragon 8 Gen 2, and 5000mAh battery.', rating: 4.7, stock: 15, image: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s23/thumbnail.webp' },
    { id: 16, name: 'Dell Laptop i5', price: 54999, category: 'electronics', description: 'Dell Inspiron 15 with Intel i5, 16GB RAM, 512GB SSD. Fast everyday performance.', rating: 4.5, stock: 10, image: 'https://cdn.dummyjson.com/product-images/laptops/dell-inspiron-15-3000-touch/thumbnail.webp' },
    { id: 17, name: 'Sony Bravia 43" TV', price: 39999, category: 'electronics', description: '43-inch 4K Ultra HD Smart TV with HDR, Dolby Audio, and Google TV.', rating: 4.6, stock: 8, image: 'https://cdn.dummyjson.com/product-images/furniture/wooden-shelving-unit/thumbnail.webp' },
    { id: 18, name: 'Canon DSLR Camera', price: 44999, category: 'electronics', description: 'Canon EOS 1500D with 24.1MP APS-C sensor. Perfect for photography beginners.', rating: 4.8, stock: 6, image: 'https://cdn.dummyjson.com/product-images/smartphones/huawei-p30/thumbnail.webp' },

    // WIRELESS (4 more)
    { id: 19, name: 'Sony WH-1000XM5', price: 24999, category: 'wireless', description: 'Industry-leading noise cancellation headphones with 30-hour battery life.', rating: 4.9, stock: 18, image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/iphone-charger/thumbnail.webp' },
    { id: 20, name: 'JBL Flip 6', price: 8999, category: 'wireless', description: 'Portable waterproof Bluetooth speaker with 12 hours playtime and deep bass.', rating: 4.6, stock: 30, image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-pro/thumbnail.webp' },
];

async function run() {
    let added = 0;
    for (const p of newProducts) {
        const exists = await Product.findOne({ id: p.id });
        if (!exists) {
            await new Product(p).save();
            console.log(`Added: ${p.name}`);
            added++;
        } else {
            console.log(`Skip (exists): ${p.name}`);
        }
    }
    console.log(`\nDone. ${added} products added.`);
    mongoose.disconnect();
}

run();
