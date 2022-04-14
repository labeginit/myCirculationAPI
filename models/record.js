const mongoose = require('mongoose');
const schema = mongoose.Schema;

const recordSchema = new schema({
    systolic:{
        type: Number,
        required: true 
    },
    diastolic:{
        type: Number,
        required: true
    },
    heartRate:{
        type: Number,
        required: true
    }
}, {timestamps: true});

const Record = mongoose.model('Record', recordSchema) // the collection name in the DB
module.exports = Record;