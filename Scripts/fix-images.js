// Run this ONCE to fix image URLs in data.json
// Command: node fix-images.js
// It fetches real thumbnails from dummyjson and writes them into data.json

const https = require('https');
const fs = require('fs');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function main() {
    console.log('Fetching images from dummyjson...');

    // fetch from categories that match our products
    const [smartphones, laptops, tablets, shirts, accessories, watches] = await Promise.all([
        fetchJson('https://dummyjson.com/products/category/smartphones?limit=2'),
        fetchJson('https://dummyjson.com/products/category/laptops?limit=1'),
        fetchJson('https://dummyjson.com/products/category/tablets?limit=1'),
        fetchJson('https://dummyjson.com/products/category/mens-shirts?limit=2'),
        fetchJson('https://dummyjson.com/products/category/mobile-accessories?limit=2'),
        fetchJson('https://dummyjson.com/products/category/mens-watches?limit=1'),
    ]);

    // build image pool
    const images = {
        fashion_shirt:   shirts.products[0]?.thumbnail || '',
        fashion_shirt2:  shirts.products[1]?.thumbnail || '',
        fashion_watch:   watches.products[0]?.thumbnail || '',
        electronics_phone:   smartphones.products[0]?.thumbnail || '',
        electronics_phone2:  smartphones.products[1]?.thumbnail || '',
        electronics_laptop:  laptops.products[0]?.thumbnail || '',
        electronics_tablet:  tablets.products[0]?.thumbnail || '',
        wireless_earbuds:    accessories.products[0]?.thumbnail || '',
        wireless_speaker:    accessories.products[1]?.thumbnail || '',
    };

    console.log('Got images:');
    Object.entries(images).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

    // update data.json
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

    const imageMap = {
        1: images.fashion_shirt,     // Nike Casual Shoes → use shirt img as placeholder till Mayank adds shoes
        2: images.fashion_shirt2,    // Formal Shirt
        3: images.electronics_phone, // iPhone 15
        4: images.electronics_laptop,// MacBook Pro
        5: images.wireless_earbuds,  // AirPods Pro
        6: images.wireless_speaker,  // Bluetooth Speaker
        7: images.fashion_watch,     // Leather Watch
        8: images.electronics_tablet,// iPad Air
    };

    data.products = data.products.map(p => ({
        ...p,
        image: imageMap[p.id] || p.image
    }));

    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    console.log('\n✅ data.json updated with real image URLs! Reload the browser.');
}

main().catch(err => {
    console.error('Error:', err.message);
});
