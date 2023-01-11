const mongoose = require("mongoose"); //import mongoose

// piano_pulizia schema
const piano_puliziaSchema = new mongoose.Schema({
    ID_zona: String,
    data_inizio: Date,
    data_fine: Date,
    ID_robot: String,
    nome_organizzazione: String
});

const piano_pulizia = mongoose.model('piano_pulizia', piano_puliziaSchema); //convert to model named piano_pulizia
module.exports = piano_pulizia; //export for controller use