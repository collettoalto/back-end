const mongoose = require("mongoose"); //import mongoose

// coordinata schema
const coordinataSchema = new mongoose.Schema({
    longitudine: {
        type: Number,
        required: true
    },
    latitudine: {
        type: Number,
        required: true
    },
    altitudine: {
        type: Number,
        required: true
    },
});

const coordinata = mongoose.model('coordinata', coordinataSchema); //convert to model named coordinata
module.exports = coordinata; //export for controller use