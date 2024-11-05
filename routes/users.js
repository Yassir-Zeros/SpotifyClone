const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/users.json');

// Helper functions to read and write data
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Get all users
router.get('/', (req, res) => {
    const users = readData();
    res.json(users);
});

// Get a single user by ID
router.get('/:id', (req, res) => {
    const users = readData();
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Create a new user
router.post('/', (req, res) => {
    const users = readData();
    const newUser = { id: `u${users.length + 1}`, ...req.body };
    users.push(newUser);
    writeData(users);
    res.status(201).json(newUser);
});

// Update a user by ID
router.put('/:id', (req, res) => {
    const users = readData();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        writeData(users);
        res.json(users[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a user by ID
router.delete('/:id', (req, res) => {
    const users = readData();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        writeData(users);
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
