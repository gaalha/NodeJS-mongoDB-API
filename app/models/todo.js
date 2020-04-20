const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TodoSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    completed: {type: Boolean, required: true},
});

module.exports = mongoose.model('Todo', TodoSchema, 'Todo');