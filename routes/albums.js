const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/albums.json');

const readData = () => {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const albums = readData();
    res.json(albums);
});

router.get('/:id', (req, res) => {
    const albums = readData();
    const album = albums.find(a => a.id === req.params.id);
    if (album) {
        res.json(album);
    } else {
        res.status(404).json({ message: 'Album not found' });
    }
});

router.post('/', (req, res) => {
    const albums = readData();
    const newAlbum = { id: String(albums.length + 1), ...req.body };
    albums.push(newAlbum);
    writeData(albums);
    res.status(201).json(newAlbum);
});

router.put('/:id', (req, res) => {
    const albums = readData();
    const index = albums.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        albums[index] = { ...albums[index], ...req.body };
        writeData(albums);
        res.json(albums[index]);
    } else {
        res.status(404).json({ message: 'Album not found' });
    }
});

router.delete('/:id', (req, res) => {
    const albums = readData();
    const index = albums.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        const deletedAlbum = albums.splice(index, 1);
        writeData(albums);
        res.json(deletedAlbum);
    } else {
        res.status(404).json({ message: 'Album not found' });
    }
});

module.exports = router;
