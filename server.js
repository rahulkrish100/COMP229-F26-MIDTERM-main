/**
 * Midterm API Project - COMP229
 * Implement the six equipment API endpoints described in README.md.
 * Use the array index as the ID: index 0 is the first equipment item.
 * Add exactly two personalized items to the five supplied below.
 */
import express from 'express';

const app = express();
app.use(express.json());

let equipment = [
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 },
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 },
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 },
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 },
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 },
  { name: 'Mouse', category: 'tools', brand: 'Lenovo', year: 2026, quantity: 1 },
  { name: 'Bluetooth Headphones', category: 'audio', brand: 'Jabra', year: 2026, quantity: 2 }
];

// ---------- Helpers ----------

// Returns a valid array index, or null if the id is not a whole number within range.
function getIndex(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 0 || id >= equipment.length) return null;
  return id;
}

// Returns an error message if the body is not a valid equipment item, otherwise null.
function validateEquipment(body) {
  if (!body || typeof body !== 'object') return 'Request body must be a JSON object';
  for (const key of ['name', 'category', 'brand']) {
    if (typeof body[key] !== 'string' || body[key].trim() === '') {
      return `${key} is required and must be a non-empty string`;
    }
  }
  for (const key of ['year', 'quantity']) {
    if (typeof body[key] !== 'number' || !Number.isFinite(body[key])) {
      return `${key} is required and must be a number`;
    }
  }
  return null;
}

// Keeps only the five expected fields so extra properties are not stored.
function toEquipment(body) {
  return {
    name: body.name.trim(),
    category: body.category.trim(),
    brand: body.brand.trim(),
    year: body.year,
    quantity: body.quantity
  };
}

// ---------- Endpoints ----------

// 1. GET all equipment
app.get('/api/equipment', (req, res) => {
  res.status(200).json(equipment);
});

// 2. GET filtered by category (keep this route before /:id)
app.get('/api/equipment/filter', (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  const filteredEquipment = equipment.filter(item => item.category === category);
  res.status(200).json(filteredEquipment);
});

// 3. GET one item by array index
app.get('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);
  if (index === null) {
    return res.status(404).json({ message: 'Equipment not found' });
  }
  res.status(200).json(equipment[index]);
});

// 4. POST a new item
app.post('/api/equipment', (req, res) => {
  const error = validateEquipment(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  const newItem = toEquipment(req.body);
  equipment.push(newItem);
  res.status(201).json(newItem);
});

// 5. PUT (update) an item by array index
app.put('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);
  if (index === null) {
    return res.status(404).json({ message: 'Equipment not found' });
  }
  const error = validateEquipment(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  equipment[index] = toEquipment(req.body);
  res.status(200).json(equipment[index]);
});

// 6. DELETE an item by array index
app.delete('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);
  if (index === null) {
    return res.status(404).json({ message: 'Equipment not found' });
  }
  const [removed] = equipment.splice(index, 1);
  res.status(200).json({ message: 'Equipment deleted', item: removed });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    console.error(`Cannot start on port ${PORT}: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
