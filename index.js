const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const MenuItem = require('./schema');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const app = express();
const port = process.env.port;

app.use(express.static('static'));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// PUT endpoint to update a menu item
app.put('/menu/:id', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
    if (!updatedItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }
    res.send(updatedItem);
  } catch (error) {
    res.status(400).send({ message: 'Error updating menu item', error });
  }
});

// DELETE endpoint to delete a menu item
app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }
    res.send({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error deleting menu item', error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
