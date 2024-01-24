const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
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
    },
    id: {
        type: Number,
        unique: true,
        default: 10
    }

});

sellerSchema.pre('save', function (next) {
    const doc = this;
    if (!doc.isNew) {
        return next();
    }

    Seller.find({}, 'id')
    .sort({ id: -1 })
    .limit(1)
    .then((sellers) => {
        const maxId = sellers.length > 0 ? sellers[0].id : 9;
        doc.id = maxId + 1;
        next();
    })
    .catch((error) => {
        next(error);
    });
});

sellerSchema.methods.cleanup = function() {
    return{
        id: this.id,
        name: this.name,
        valoration: this.valoration,
        orders: this.orders,
        reviews: this.reviews,
        email: this.email
    }
}

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;