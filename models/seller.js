const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    id : {
        type: Number,
        required: true    
    },
    name : {
        type: String,
        required: true
    },
    valoration : {
        type: Number,
        required: true
    }, 
    orders: {
        type: Number,
        required: true
    },
    reviews: {
        type: Number,
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

sellerSchema.methods.cleanup = function() {
    return{
        name: this.name,
        valoration: this.valoration,
        orders: this.orders,
        reviews: this.reviews
    }
}

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;