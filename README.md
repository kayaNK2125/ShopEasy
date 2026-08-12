# 🛍️ ShopEasy

**Shop Smart. Live Better.**

ShopEasy is a full-stack e-commerce web application built as an individual project during the **PBEL (Project Based Experiential Learning) | IBM-NASSCOM Virtual Internship Program**.

The project combines a responsive frontend with a Node.js/Express backend and MongoDB Atlas database to provide a complete product browsing, cart, checkout, and order flow.

---

## ✨ Features

* 🛍️ Product browsing across multiple categories
* 📦 Dynamic product listing from MongoDB Atlas
* 🔎 Product search and category filtering
* 🛒 Shopping cart with quantity management
* 🔐 User registration and login
* 📋 Checkout and order flow
* 🔄 REST API CRUD operations for products
* 🧪 API testing with Postman
* 🌙 Dark/light theme
* 📱 Responsive user interface
* 📦 Order confirmation with generated order ID
* ☁️ Vercel deployment

> **Note:** The payment section is currently a simulated checkout/payment-method flow. A real payment gateway such as Razorpay has not been integrated.

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Development & Deployment

* Postman
* Git
* GitHub
* Vercel

---

## 🏗️ Project Structure

```text
ShopEasy/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── cart.html
│   ├── payment.html
│   ├── contact.html
│   ├── app.js
│   ├── login.js
│   ├── cart.js
│   ├── payment.js
│   ├── theme.js
│   └── style.css
│
├── index.js
├── package.json
├── package-lock.json
├── data.json
├── vercel.json
└── README.md
```

---

## 🔄 How It Works

The basic application flow is:

```text
User
  ↓
Frontend (HTML / CSS / JavaScript)
  ↓
REST API
  ↓
Node.js + Express
  ↓
Mongoose
  ↓
MongoDB Atlas
  ↓
JSON Response
  ↓
Frontend UI
```

For example, when products are loaded:

```text
GET /products
      ↓
Express route
      ↓
MongoDB query
      ↓
Products returned as JSON
      ↓
JavaScript renders product cards
```

---

## 🔌 API Endpoints

### Products

| Method | Endpoint        | Purpose             |
| ------ | --------------- | ------------------- |
| GET    | `/products`     | Get all products    |
| GET    | `/products/:id` | Get a product by ID |
| POST   | `/addproduct`   | Add a new product   |
| PUT    | `/products/:id` | Update a product    |
| DELETE | `/products/:id` | Delete a product    |

### Users

| Method | Endpoint     | Purpose             |
| ------ | ------------ | ------------------- |
| GET    | `/users`     | Get all users       |
| GET    | `/users/:id` | Get a user by ID    |
| POST   | `/adduser`   | Create a user       |
| PUT    | `/users/:id` | Update a user       |
| DELETE | `/users/:id` | Delete a user       |
| POST   | `/login`     | Authenticate a user |

### Orders

| Method | Endpoint    | Purpose         |
| ------ | ----------- | --------------- |
| GET    | `/orders`   | Get all orders  |
| POST   | `/addorder` | Create an order |

---

## 💻 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/kayaNK2125/ShopEasy.git
cd ShopEasy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
```

Do **not** commit `.env` to GitHub.

### 4. Start the backend

```bash
node index.js
```

The application will run locally through the Node.js/Express server.

---

## 🔐 Environment Variables

The MongoDB connection string is stored in an environment variable rather than directly in the source code.

```text
MONGO_URI
```

The `.env` file is excluded through `.gitignore` to prevent database credentials from being committed to the repository.

---

## 🧪 Testing the API

The REST APIs can be tested using **Postman**.

Example:

### Add Product

```http
POST /addproduct
Content-Type: application/json
```

Example JSON:

```json
{
  "id": 21,
  "name": "Gaming Mouse",
  "price": 2499,
  "category": "electronics",
  "description": "RGB gaming mouse with programmable buttons",
  "rating": 4.8,
  "stock": 20,
  "image": "https://example.com/mouse.jpg"
}
```

### Delete Product

```http
DELETE /products/21
```

---

## 📚 What I Learned

This project gave me practical experience with:

* Building a full-stack web application
* Connecting frontend and backend
* Designing and consuming REST APIs
* MongoDB database integration
* Mongoose schemas and models
* CRUD operations
* API testing with Postman
* Environment variables and configuration security
* Git and GitHub
* Deploying a Node.js application to Vercel
* Debugging production deployment and database connection issues

---


## 👨‍💻 Author

**Mayank Gupta**

B.Tech CSE Student

**GitHub:**
https://github.com/kayaNK2125

---

## 📄 License

This project was created for educational and internship purposes.
