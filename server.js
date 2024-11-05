const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

const albumsRoute = require('./routes/albums');
app.use('/albums', albumsRoute);

const artistsRoute = require('./routes/artists');
app.use('/artists', artistsRoute);

const tracksRoute = require('./routes/tracks');
app.use('/tracks', tracksRoute);

const playlistsRoute = require('./routes/playlists');
app.use('/playlists', playlistsRoute);

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
