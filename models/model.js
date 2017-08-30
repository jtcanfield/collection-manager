const mongoose = require('mongoose');

const videogameSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    developer: { type: String },
    isitgood: {type: Boolean},
    saves: [{
        name: { type: String, required: true },
        time: { type: String, lowercase: true }
    }],
})

const videogame = mongoose.model('VideoGame', videogameSchema);

module.exports = videogame;
