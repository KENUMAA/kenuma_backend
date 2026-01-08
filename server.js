const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let products = [
  { id: 1, name: "Paracetamol", price: 25.50, category: "Medicines", imageUrl: "assets/images/paracetamol.jpg" },
  { id: 2, name: "Vaseline", price: 85.00, category: "Cosmetics", imageUrl: "assets/images/vaseline.jpg" },
  { id: 3, name: "Baby Diapers", price: 320.00, category: "Baby Products", imageUrl: "assets/images/baby_diapers.jpg" },
  { id: 4, name: "Vitamin C", price: 150.00, category: "Vitamins", imageUrl: "assets/images/vitamin_c.jpg" },
  { id: 5, name: "Face Mask", price: 45.00, category: "Personal Care", imageUrl: "assets/images/face_mask.jpg" }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, '../kenuma_pharma')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// GET products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST add/edit product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const index = products.findIndex(p => p.id === newProduct.id);
  if (index >= 0) {
    products[index] = newProduct;
  } else {
    products.push(newProduct);
  }
  res.json({ success: true });
});

// DELETE product
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

// Payment endpoint
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

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://10.201.114.178:${PORT}`);
  console.log(`   Admin: http://10.201.114.178:${PORT}/admin`);
});