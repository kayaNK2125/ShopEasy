// node fix-all.js — run once then DELETE this file
// Fetches thumbnails from correct dummyjson CATEGORIES (not random IDs)

const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected'))
    .catch(err => { console.log(err); process.exit(1); });

const Product = mongoose.model('Product', new mongoose.Schema({
    id: Number, name: String, price: Number, category: String,
    description: String, rating: Number, stock: Number, image: String
}));

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
        }).on('error', reject);
    });
}

// fetch thumbnails from a dummyjson category
async function getThumbs(category, limit = 10) {
    const data = await get(`https://dummyjson.com/products/category/${category}?limit=${limit}&select=thumbnail`);
    return data.products.map(p => p.thumbnail);
}

async function run() {
    console.log('Fetching thumbnails by category from dummyjson...\n');

    // fetch thumbnails per category
    const [shirts, watches, shoes, shades, phones, laptops, tablets, accessories] = await Promise.all([
        getThumbs('mens-shirts', 10),
        getThumbs('mens-watches', 10),
        getThumbs('mens-shoes', 6),
        getThumbs('sunglasses', 4),
        getThumbs('smartphones', 6),
        getThumbs('laptops', 6),
        getThumbs('tablets', 4),
        getThumbs('mobile-accessories', 8),
    ]);

    // assign correct category thumbnails to our products
    const updates = [
        // FASHION - shirts
        { id: 1,  image: shirts[0] },
        { id: 2,  image: shirts[1] },
        { id: 9,  image: shirts[2] },
        { id: 10, image: shirts[3] },
        { id: 13, image: shirts[4] },
        // FASHION - watches & jewellery
        { id: 7,  image: watches[0] },
        { id: 14, image: watches[1] },
        // FASHION - shoes
        { id: 11, image: shoes[0] },
        // FASHION - sunglasses
        { id: 12, image: shades[0] },
        // ELECTRONICS - phones
        { id: 3,  image: phones[0] },
        { id: 15, image: phones[1] },
        { id: 18, image: phones[2] },
        // ELECTRONICS - laptops
        { id: 4,  image: laptops[0] },
        { id: 16, image: laptops[1] },
        { id: 17, image: laptops[2] },
        // ELECTRONICS - tablets
        { id: 8,  image: tablets[0] },
        // WIRELESS - accessories
        { id: 5,  image: accessories[0] },
        { id: 6,  image: accessories[1] },
        { id: 19, image: accessories[2] },
        { id: 20, image: accessories[3] },
    ];

    for (const u of updates) {
        if (!u.image) { console.log(`✗ No image for product ${u.id}`); continue; }
        const result = await Product.findOneAndUpdate({ id: u.id }, { image: u.image }, { new: true });
        if (result) console.log(`✓ ${result.name} → ${u.image}`);
        else console.log(`✗ Product ${u.id} not found in DB`);
    }

    console.log('\nDone! Refresh your browser.');
    mongoose.disconnect();
}

run();
