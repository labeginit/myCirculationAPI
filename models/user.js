const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email:{
        type: String,
        required: true 
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    birthDate:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {timestamps: false});

const User = mongoose.model('User', userSchema);
module.exports = User;