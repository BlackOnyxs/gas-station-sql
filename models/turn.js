const { Schema, model } = require('mongoose');

const turnSchema = Schema({
    startTime: {
        type: String,
        require: [true, 'startTime is requied.']
    },
    endTime: {
        type: String,
        require: [true, 'endTime is requied.']
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

module.exports = model('Turn', turnSchema);