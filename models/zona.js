const mongoose = require("mongoose"); //import mongoose

// zona schema
const zonaSchema = new mongoose.Schema({
    regione: [{
        LAT: Number,
        LON: Number,
        ALT: Number,
        _id: false
    }],
    contenitori_rifiuti: [{
        tipologia: String,
        posizione: {
            LAT: Number,
            LON: Number,
            ALT: Number,
        }
    }]
});

// zona model
const zona = mongoose.model("Zona", zonaSchema);
module.exports = zona;