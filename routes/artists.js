const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/artists.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
    const artists = readData();
    res.json(artists);
});

router.get('/:id', (req, res) => {
    const artists = readData();
    const artist = artists.find(a => a.id === req.params.id);
    if (artist) {
        res.json(artist);
    } else {
        res.status(404).json({ message: 'Artist not found' });
    }
});

router.post('/', (req, res) => {
    const artists = readData();
    const newArtist = { id: String(artists.length + 1), ...req.body };
    artists.push(newArtist);
    writeData(artists);
    res.status(201).json(newArtist);
});

router.put('/:id', (req, res) => {
    const artists = readData();
    const index = artists.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        artists[index] = { ...artists[index], ...req.body };
        writeData(artists);
        res.json(artists[index]);
    } else {
        res.status(404).json({ message: 'Artist not found' });
    }
});

router.delete('/:id', (req, res) => {
    const artists = readData();
    const index = artists.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        const deletedArtist = artists.splice(index, 1);
        writeData(artists);
        res.json(deletedArtist);
    } else {
        res.status(404).json({ message: 'Artist not found' });
    }
});

module.exports = router;
