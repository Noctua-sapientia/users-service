const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    id : {
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    surnames : {
        type: String,
        required: true
    }, 
    address : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }

});

customerSchema.methods.cleanup = function() {
    return{
        name: this.name,
        surnames: this.surnames,
        address: this.address
    }
}

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;