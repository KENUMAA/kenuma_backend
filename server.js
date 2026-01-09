const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

let products = [
  { id: 1, name: "Paracetamol", price: 25.50, category: "Medicines", imageUrl: "https://kenuma-backend.onrender.com/images/paracetamol.jpg" },
  { id: 2, name: "Vaseline", price: 85.00, category: "Cosmetics", imageUrl: "https://kenuma-backend.onrender.com/images/vaseline.jpg" },
  { id: 3, name: "Baby Diapers", price: 320.00, category: "Baby Products", imageUrl: "https://kenuma-backend.onrender.com/images/baby_diapers.jpg" },
  { id: 4, name: "Vitamin C", price: 150.00, category: "Vitamins", imageUrl: "https://kenuma-backend.onrender.com/images/vitamin_c.jpg" },
  { id: 5, name: "Face Mask", price: 45.00, category: "Personal Care", imageUrl: "https://kenuma-backend.onrender.com/images/face_mask.jpg" }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = Number(newProduct.id);
  newProduct.price = Number(newProduct.price);
  if (!newProduct.imageUrl?.startsWith('http')) {
    newProduct.imageUrl = `https://kenuma-backend.onrender.com/images/${newProduct.imageUrl}`;
  }
  const index = products.findIndex(p => p.id === newProduct.id);
  if (index >= 0) {
    products[index] = newProduct;
  } else {
    products.push(newProduct);
  }
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products.splice(index, 1);
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