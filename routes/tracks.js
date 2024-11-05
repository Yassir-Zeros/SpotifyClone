const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/tracks.json');

// Helper functions to read and write data
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Get all tracks
router.get('/', (req, res) => {
    const tracks = readData();
    res.json(tracks);
});

// Get a single track by ID
router.get('/:id', (req, res) => {
    const tracks = readData();
    const track = tracks.find(t => t.id === req.params.id);
    if (track) {
        res.json(track);
    } else {
        res.status(404).json({ message: 'Track not found' });
    }
});

// Create a new track
router.post('/', (req, res) => {
    const tracks = readData();
    const newTrack = { id: `t${tracks.length + 1}`, ...req.body };
    tracks.push(newTrack);
    writeData(tracks);
    res.status(201).json(newTrack);
});

// Update a track by ID
router.put('/:id', (req, res) => {
    const tracks = readData();
    const index = tracks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        tracks[index] = { ...tracks[index], ...req.body };
        writeData(tracks);
        res.json(tracks[index]);
    } else {
        res.status(404).json({ message: 'Track not found' });
    }
});

// Delete a track by ID
router.delete('/:id', (req, res) => {
    const tracks = readData();
    const index = tracks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        const deletedTrack = tracks.splice(index, 1);
        writeData(tracks);
        res.json(deletedTrack);
    } else {
        res.status(404).json({ message: 'Track not found' });
    }
});

module.exports = router;
