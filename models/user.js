const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String, validate: /[a-z]/,
        required: true
    },
    lastName: {
        type: String, validate: /[a-z]/,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: false
}, {
    collection: 'users'
});

const User = mongoose.model('User', userSchema);
module.exports = User;