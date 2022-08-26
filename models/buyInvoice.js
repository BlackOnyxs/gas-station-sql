const { Schema, model } = require('mongoose');

const buyInvoice = Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        require: [true, 'quantity is required']
    },
    total: {
        type: Number,
        require: [true, 'quantity is required']
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
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

module.exports = model('BuyInvoice', buyInvoice);