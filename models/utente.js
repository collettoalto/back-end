const mongoose = require("mongoose"); //import mongoose

// utente schema
const UtenteSchema = new mongoose.Schema({
    username: String,
    email: String,
    numero_tel: String,
    hash_password: String,
    ruolo: String,
    nomi_organizzazioni: [String]
});

const Utente = mongoose.model('Utente', UtenteSchema); //convert to model named Utente
module.exports = Utente; //export for controller use