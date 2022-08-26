const { Schema, model } = require('mongoose');


const fuelSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    buyPrice: {
        type: Number,
        required: [true, 'buyPrice is required']
    },
    sellPrice: {
        type: Number,
        required: [true, 'sellPrice is required']
    },
    type: {
        type: String,
        required: true,
        default: 'Gasolina',
        emun: ['Gasolina', 'Diesel']
    },
    octane: {
        type: String,
        required: true,
        default: '95',
        emun: ['95', '91', 'BA']
    },
    inventory: {
        type: Number,
        default: 0.00
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

module.exports = model('Fuel', fuelSchema)