const mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    grid: {
        type: [[String]],
        required: true
    }
}, { timestamp: true });

module.exports = mongoose.model('GameCode', codeSchema);