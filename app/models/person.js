const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PersonSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    department: {type: String, required: true},
    dui: {type: String, required: true},
    nit: {type: String, required: true},
    cellphone: {type: String, required: true},
    telephone: {type: String, required: true},
    birthDate: {type: String, required: true},
    gender: {type: String, required: true},
    lenguages: {type: String, required: true},
    address: {type: String, required: true},
    emergencyContact: {type: String, required: true},
    licenceNumber: {type: String, required: true},
    hireOn: {type: String, required: true}
});

module.exports = mongoose.model('Person', PersonSchema, 'Person');