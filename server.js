const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

function getProducts() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products.json:', err);
    return [];
  }
}

function saveProducts(products) {
  try {
    fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error saving products.json:', err);
  }
}

app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = Number(newProduct.id);
  newProduct.price = Number(newProduct.price);
  if (!newProduct.imageUrl?.startsWith('http')) {
    newProduct.imageUrl = `https://kenuma-backend.onrender.com/images/${newProduct.imageUrl}`;
  }

  const products = getProducts();
  const index = products.findIndex(p => p.id === newProduct.id);
  if (index >= 0) {
    products[index] = newProduct;
  } else {
    products.push(newProduct);
  }
  saveProducts(products);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products.splice(index, 1);
    saveProducts(products);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/pay', (req, res) => {
  const { amount, phone, paymentMethod, cartItems } = req.body;
  if (!amount || !phone || !paymentMethod) {
    return res.status(400).json({ error: 'Missing payment details' });
  }
  const mockReference = 'REF-' + Date.now();
  console.log(`✅ New order: ${amount} Br via ${paymentMethod} for ${phone}`);
  console.log('Items:', cartItems);
  res.json({
    success: true,
    message: 'Payment initiated successfully',
    reference: mockReference,
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running`);
});