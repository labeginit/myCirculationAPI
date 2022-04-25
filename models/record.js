const mongoose = require('mongoose');
const schema = mongoose.Schema;

const recordSchema = new schema({
    userID: {
        type: String,
        required: true
    },
    systolic: {
        type: Number,
        min: [10, 'The value is too low'],
        max: [250, 'The value is too high'],
        required: true
    },
    diastolic: {
        type: Number,
        min: [10, 'The value is too low'],
        max: [250, 'The value is too high'],
        required: true
    },
    heartRate: {
        type: Number,
        min: [1, 'The value is too low'],
        max: [250, 'The value is too high'],
        required: true
    }
}, {
    timestamps: true
}, {
    collection: 'records'
});

const Record = mongoose.model('Record', recordSchema)
module.exports = Record;