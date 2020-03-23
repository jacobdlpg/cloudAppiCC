// Requires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const addressSchema = require('../schemas/address');
require('mongoose-type-email');

// Variable initialization
let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: mongoose.SchemaTypes.Email, 
        unique: true,
        required: [true, 'Email is required']
    },
    birthDate: { 
        type: String,
        required: [true, 'Birthdate is required']
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required']
    }
});

userSchema.plugin( uniqueValidator, { message: '{PATH} must be unique' } );


module.exports = mongoose.model( 'User', userSchema );
