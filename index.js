const express = require('express');
const app = express();
const fs = require('fs'); 

app.use(express.json());

const cors = require('cors');
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('Ecommerce API is running');
});

//READ - ALL
app.get('/products', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8'); 
  const parsed = JSON.parse(data);  
  res.json(parsed.products);  
});

//READ - Single by id
app.get('/products/:id', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);   
  const product = parsed.products.find(p => p.id == req.params.id);
  if (!product) 
    return res.status(404).send('Product not found'); 
  res.json(product);
});

//CREATE 
app.post('/addproduct', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);
  parsed.products.push(req.body);
  fs.writeFileSync('./data.json', JSON.stringify(parsed));
  res.send('Product added!');
});

// DELETE - product id
app.delete('/products/:id', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);
  parsed.products = parsed.products.filter(p => p.id!= req.params.id); 
  fs.writeFileSync('./data.json', JSON.stringify(parsed));
  res.send('Product deleted!');
});

// UPDATE - id
app.put('/products/:id', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);
  const index = parsed.products.findIndex(p => p.id == req.params.id); 
  if (index === -1) 
    return res.status(404).send('Product not found');
  parsed.products[index] = { ...parsed.products[index], ...req.body }; 
  fs.writeFileSync('./data.json', JSON.stringify(parsed));
  res.send('Product updated!');
});


app.get('/contactus', (req, res) => {
  res.json('This is Contact-Us page');
});

//READ - ALL
app.get ('/users', (req,res) => {
    const data = fs.readFileSync('./data.json', 'utf-8');
    const parsed = JSON.parse(data);
    res.send(parsed.users);
});

//READ - Single by id
app.get('/users/:id', (req , res) => {
    const data = fs.readFileSync('./data.json' , 'utf-8');
    const parsed = JSON.parse(data);
    const users = parsed.users.find(p => p.id == req.params.id);
    if(!users) 
      return res.status(404).send('User not found');
    res.json(users);
});

//CREATE
app.post ('/adduser', (req,res) =>{
      const data = fs.readFileSync('./data.json', 'utf-8');
    const parse_data = JSON.parse(data);
    parse_data.users.push(req.body);  
    fs.writeFileSync('./data.json', JSON.stringify(parse_data)) 
    res.send("Student has been added !")
})

//DELETE - user id
app.delete('/users/:id', (req,res) => {
    const data = fs.readFileSync('./data.json', 'utf-8');
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.filter(p => p.id != req.params.id); 
    fs.writeFileSync('./data.json', JSON.stringify(parsed));  
    res.send('User deleted!');
});

//UPDATE - id
app.put('/users/:id', (req,res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);
  const index = parsed.users.findIndex( p => p.id == req.params.id); 
  if(index === -1)
    return res.status(404).send('User not found');
  parsed.users[index] = { ...parsed.users[index], ...req.body }; 
  fs.writeFileSync('./data.json', JSON.stringify(parsed));
  res.send('User updated');
});

//ORDER - get all
app.get('/orders', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  const parsed = JSON.parse(data);
  res.json(parsed.orders);
});


//ORDER - post
app.post ('/addorder', (req,res) =>{
    const data = fs.readFileSync('./data.json', 'utf-8');
    const parse_data = JSON.parse(data);
    parse_data.orders.push(req.body);  
    fs.writeFileSync('./data.json', JSON.stringify(parse_data)) 
    res.send("Status Added!")
})


app.listen(3000, () => {
  console.log('Server running on port 3000');
});




