const { Schema, model } = require('mongoose');

const sellInvoice = Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    total: {
        type: Number,
        require: [true, 'quantity is required']
    },
    dispenser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        // required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String,
        required: [true, 'createdAt is required.'],
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedAt: {
        type: String,
        required: [true, 'lastModifiedAt is required.'],
    },
});

module.exports = model('SellInvoice', sellInvoice);