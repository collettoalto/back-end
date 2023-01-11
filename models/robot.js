const mongoose = require("mongoose"); //import mongoose

// robot schema
const robotSchema = new mongoose.Schema({
    capienza_attuale: Number,
    temperatura: Number,
    batteria: Number,
    posizione: {
        LAT: Number,
        LON: Number,
        ALT: Number,
    },
    online: Boolean,
    nome_organizzazione: String,
});

const robot = mongoose.model('robot', robotSchema); //convert to model named robot
module.exports = robot; //export for controller use