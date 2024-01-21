const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surnames: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        unique: true,
        default: 10
    }
});

customerSchema.pre('save', function (next) {
    const doc = this;
    if (!doc.isNew) {
        return next();
    }

    Customer.find({}, 'id')
    .sort({ id: -1 })
    .limit(1)
    .then((customers) => {
        const maxId = customers.length > 0 ? customers[0].id : 9;
        doc.id = maxId + 1;
        next();
    })
    .catch((error) => {
        next(error);
    });
});

customerSchema.methods.cleanup = function () {
    return {
        id: this.id,
        name: this.name,
        surnames: this.surnames,
        address: this.address
    };
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
