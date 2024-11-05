const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/playlists.json');

// Helper functions to read and write data
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Get all playlists
router.get('/', (req, res) => {
    const playlists = readData();
    res.json(playlists);
});

// Get a single playlist by ID
router.get('/:id', (req, res) => {
    const playlists = readData();
    const playlist = playlists.find(p => p.id === req.params.id);
    if (playlist) {
        res.json(playlist);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Create a new playlist
router.post('/', (req, res) => {
    const playlists = readData();
    const newPlaylist = { id: `p${playlists.length + 1}`, ...req.body };
    playlists.push(newPlaylist);
    writeData(playlists);
    res.status(201).json(newPlaylist);
});

// Update a playlist by ID
router.put('/:id', (req, res) => {
    const playlists = readData();
    const index = playlists.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        playlists[index] = { ...playlists[index], ...req.body };
        writeData(playlists);
        res.json(playlists[index]);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Delete a playlist by ID
router.delete('/:id', (req, res) => {
    const playlists = readData();
    const index = playlists.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        const deletedPlaylist = playlists.splice(index, 1);
        writeData(playlists);
        res.json(deletedPlaylist);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Add track to playlist
router.post('/:id/tracks', (req, res) => {
    const playlists = readData();
    const playlist = playlists.find(p => p.id === req.params.id);
    if (playlist) {
        playlist.tracks.push(req.body.trackId);
        writeData(playlists);
        res.json(playlist);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Remove track from playlist
router.delete('/:id/tracks/:trackId', (req, res) => {
    const playlists = readData();
    const playlist = playlists.find(p => p.id === req.params.id);
    if (playlist) {
        const index = playlist.tracks.indexOf(req.params.trackId);
        if (index !== -1) {
            playlist.tracks.splice(index, 1);
            writeData(playlists);
            res.json(playlist);
        } else {
            res.status(404).json({ message: 'Track not found in playlist' });
        }
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

module.exports = router;
