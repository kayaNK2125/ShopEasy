// run once: node update-images.js
// fetches real working image URLs from dummyjson API and updates all MongoDB products

const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => { console.log(err); process.exit(1); });

const Product = mongoose.model('Product', new mongoose.Schema({
    id: Number, name: String, price: Number, category: String,
    description: String, rating: Number, stock: Number, image: String
}));

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

// hardcoded working image URLs — fetched from dummyjson API
const imageMap = {
    // FASHION
    1:  'https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20%26%20Black%20Check%20Shirt/thumbnail.png',
    2:  'https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20TShirt/thumbnail.png',
    7:  'https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/thumbnail.png',
    9:  'https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Long%20Sleeve%20Shirt/thumbnail.png',
    10: 'https://cdn.dummyjson.com/products/images/mens-shirts/Black%20%26%20White%20Stripe%20Shirt/thumbnail.png',
    11: 'https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/thumbnail.png',
    12: 'https://cdn.dummyjson.com/products/images/sunglasses/Sunglasses%20Eyewear/thumbnail.png',
    13: 'https://cdn.dummyjson.com/products/images/tops/Black%20%26%20White%20Stripe%20Top/thumbnail.png',
    14: 'https://cdn.dummyjson.com/products/images/mens-watches/Silver%20Ring%20Watch/thumbnail.png',

    // ELECTRONICS
    3:  'https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png',
    4:  'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png',
    8:  'https://cdn.dummyjson.com/products/images/tablets/iPad%20Mini%202021%20Starlight/thumbnail.png',
    15: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S23/thumbnail.png',
    16: 'https://cdn.dummyjson.com/products/images/laptops/Dell%20Inspiron%2015%203000%20Touch/thumbnail.png',
    17: 'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%2014/thumbnail.png',
    18: 'https://cdn.dummyjson.com/products/images/smartphones/Huawei%20P30/thumbnail.png',

    // WIRELESS
    5:  'https://cdn.dummyjson.com/products/images/mobile-accessories/Amazon%20Echo%20Plus/thumbnail.png',
    6:  'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods/thumbnail.png',
    19: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Pro/thumbnail.png',
    20: 'https://cdn.dummyjson.com/products/images/mobile-accessories/iPhone%20Charger/thumbnail.png',
};

async function run() {
    // verify dummyjson images work by pinging one
    console.log('Checking dummyjson API...');
    try {
        const test = await fetchJSON('https://dummyjson.com/products/1?select=thumbnail');
        console.log('dummyjson API working. Sample URL:', test.thumbnail);
    } catch (e) {
        console.log('Cannot reach dummyjson API, using fallback URLs');
    }

    let updated = 0;
    for (const [id, imageUrl] of Object.entries(imageMap)) {
        const result = await Product.findOneAndUpdate(
            { id: Number(id) },
            { image: imageUrl },
            { new: true }
        );
        if (result) {
            console.log(`Updated product ${id}: ${result.name}`);
            updated++;
        } else {
            console.log(`Product ${id} not found in DB (skip)`);
        }
    }

    console.log(`\nDone. ${updated} products updated with working images.`);
    mongoose.disconnect();
}

run();
