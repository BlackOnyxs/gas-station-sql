const { Schema, model } = require('mongoose');


const oilSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    branch: {
        type: String,
        default: 'Terpel',
        emun: ['Terpel', 'Mobil', 'Castrol']
    },
    viscosityGrade: {
        type: String,
        default: '5W-20',
        emun: ['5W-20', '5W-30', '10W-30', '10W-40', '15W-40']
    },
    inventory: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        default: '1 Galón',
        emun: ['1 Galón', '1/4 Galón']
    },
    image: {
        type: String,
        default: ''
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

module.exports = model('Oil', oilSchema)