const mongoose = require('mongoose');
const schema = mongoose.Schema;

const recordSchema = new schema({
    userID: {
        type: String,
        required: true
    },
    systolic: {
        type: Number, max: 250,
        required: true
    },
    diastolic: {
        type: Number, max: 250,
        required: true
    },
    heartRate: {
        type: Number, max: 220,
        required: true
    }
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema) // the collection name in the DB
module.exports = Record;