const mongoose = require("mongoose"); //import mongoose

// rifiuto schema
const rifiutoSchema = new mongoose.Schema({
    URL_foto: {
        type: String,
        required: true
    },
    posizione: {
        LAT: Number,
        LON: Number,
        ALT: Number,
    },
    classificazione: String,
    id_zona: String,
});

const rifiuto = mongoose.model('rifiuto', rifiutoSchema); //convert to model named rifiuto
module.exports = rifiuto; //export for controller use