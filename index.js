const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.log('MongoDB connection error:', err));

// =====================
// SCHEMAS & MODELS
// =====================

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: String,
    description: String,
    rating: Number,
    stock: Number,
    image: String
});

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    phone: String,
    password: String,
    gender: String
});

const orderSchema = new mongoose.Schema({
    id: Number,
    items: Array,
    total: Number,
    status: String
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// =====================
// PRODUCT ROUTES
// =====================

// READ - all products
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// READ - single product by id
app.get('/products/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

// CREATE - add product
app.post('/addproduct', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send('Product added!');
});

// UPDATE - edit product by id
app.put('/products/:id', async (req, res) => {
    const product = await Product.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
    );
    if (!product) return res.status(404).send('Product not found');
    res.send('Product updated!');
});

// DELETE - remove product by id
app.delete('/products/:id', async (req, res) => {
    await Product.findOneAndDelete({ id: req.params.id });
    res.send('Product deleted!');
});

// =====================
// USER ROUTES
// =====================

// READ - all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// READ - single user by id
app.get('/users/:id', async (req, res) => {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// CREATE - add user
app.post('/adduser', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send('User added!');
});

// UPDATE - edit user by id
app.put('/users/:id', async (req, res) => {
    const user = await User.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.send('User updated!');
});

// DELETE - remove user by id
app.delete('/users/:id', async (req, res) => {
    await User.findOneAndDelete({ id: req.params.id });
    res.send('User deleted!');
});

// =====================
// ORDER ROUTES
// =====================

// READ - all orders
app.get('/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// CREATE - place order
app.post('/addorder', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.send('Order placed!');
});

// LOGIN - check email + password
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ message: 'Login successful', user });
});

// contact page route
app.get('/contactus', (req, res) => {
    res.json('This is Contact-Us page');
});

app.get('/', (req, res) => res.send('Ecommerce API is running'));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
