// Requires
const mongoose = require('mongoose');

// Variable initialization
let Schema = mongoose.Schema;


let addressSchema = new Schema({
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    city: { 
        type: String,
        required: [true, 'City is required'] 
    },
    country: { 
        type: String,
        required: [true, 'Country is required'] 
    },
    zip: { 
        type: String,
        required: [true, 'Zip is required'] 
    }
});


module.exports = addressSchema;
