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
    if (!fs.existsSync(path.join(__dirname, 'products.json'))) {
      // Create default file if missing
      const defaultProducts = [
        { id: 1, name: "Paracetamol", price: 25.50, category: "Medicines", imageUrl: "https://kenuma-backend.onrender.com/images/paracetamol.jpg" },
        { id: 2, name: "Vaseline", price: 85.00, category: "Cosmetics", imageUrl: "https://kenuma-backend.onrender.com/images/vaseline.jpg" },
        { id: 3, name: "Baby Diapers", price: 320.00, category: "Baby Products", imageUrl: "https://kenuma-backend.onrender.com/images/baby_diapers.jpg" },
        { id: 4, name: "Vitamin C", price: 150.00, category: "Vitamins", imageUrl: "https://kenuma-backend.onrender.com/images/vitamin_c.jpg" },
        { id: 5, name: "Face Mask", price: 45.00, category: "Personal Care", imageUrl: "https://kenuma-backend.onrender.com/images/face_mask.jpg" }
      ];
      fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(defaultProducts, null, 2));
    }
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

// GET products
app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

// POST add/edit product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = Number(newProduct.id);
  newProduct.price = Number(newProduct.price);
  if (!newProduct.imageUrl?.startsWith('http')) {
    newProduct.imageUrl = `https://kenuma-backend.onrender.com/images/${newProduct.imageUrl}`;
  }

  let products = getProducts();
  const index = products.findIndex(p => p.id === newProduct.id);
  if (index >= 0) {
    products[index] = newProduct;
  } else {
    // Ensure new ID is unique
    const maxId = products.length ? Math.max(...products.map(p => p.id)) : 5;
    newProduct.id = maxId + 1;
    products.push(newProduct);
  }
  saveProducts(products);
  res.json({ success: true });
});

// DELETE product
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});