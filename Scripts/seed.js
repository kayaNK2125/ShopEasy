// Run this ONCE to populate MongoDB with initial data
// Command: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    id: Number, name: String, price: Number, category: String,
    description: String, rating: Number, stock: Number, image: String
});
const userSchema = new mongoose.Schema({
    id: Number, name: String, email: String, gender: String
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

const products = [
    { id: 1, name: "Steiped Shirt", price: 2499, category: "fashion", description: "Lightweight and comfortable everyday shirt perfect for casual outings and travel.", rating: 4.5, stock: 30, image: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp" },
    { id: 2, name: "Formal Shirt", price: 799, category: "fashion", description: "Classic slim-fit formal shirt ideal for office and semi-formal occasions.", rating: 4.2, stock: 50, image: "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp" },
    { id: 3, name: "iPhone 15", price: 79999, category: "electronics", description: "Apple iPhone 15 with A16 Bionic chip, 48MP main camera and Dynamic Island display.", rating: 4.8, stock: 10, image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp" },
    { id: 4, name: "MacBook Pro", price: 124999, category: "electronics", description: "Apple MacBook Pro 14-inch with M3 chip. Blazing fast performance for professionals.", rating: 4.9, stock: 8, image: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp" },
    { id: 5, name: "AirPods Pro", price: 19999, category: "wireless", description: "Active Noise Cancellation, Transparency mode, and Adaptive Audio for immersive sound.", rating: 4.7, stock: 25, image: "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp" },
    { id: 6, name: "Bluetooth Speaker", price: 3499, category: "wireless", description: "Portable 360-degree sound with 12-hour battery life and waterproof design.", rating: 4.3, stock: 40, image: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp" },
    { id: 7, name: "Leather Watch", price: 3999, category: "fashion", description: "Elegant brown leather strap watch with stainless steel case. Classic everyday wear.", rating: 4.4, stock: 20, image: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp" },
    { id: 8, name: "iPad Air", price: 59999, category: "electronics", description: "iPad Air with M1 chip, 10.9-inch Liquid Retina display. Perfect for work and creativity.", rating: 4.6, stock: 12, image: "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp" }
];

const users = [
    { id: 1, name: "Mayank", email: "mayank@gmail.com", gender: "male" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com", gender: "male" }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // clear existing data first
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared old data...');

    // insert fresh data
    await Product.insertMany(products);
    await User.insertMany(users);
    console.log('Seeded 8 products and 2 users successfully!');

    mongoose.connection.close();
}

seed().catch(console.error);
