const { Schema, model } = require('mongoose');

const providerSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    telefono: {
        type: String,
        required: [true, 'name is required']
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

module.exports = model('Provider', providerSchema);