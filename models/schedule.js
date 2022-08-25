const { Schema, model } = require('mongoose');


const scheduleSchema = Schema({
    date: {
        type: String,
        require: [true, 'date is requied.']
    },
    turn: {
        type: Schema.Types.ObjectId,
        ref: 'Turn',
        required: true
    },
    dispenser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

module.exports = model('Schedule', scheduleSchema);