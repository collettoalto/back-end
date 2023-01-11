const mongoose = require("mongoose"); //import mongoose

// organisation schema
const OrganisationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employee_num: Number,
});

const Organisation = mongoose.model('Organisation', OrganisationSchema);
module.exports = Organisation; //export for controller use