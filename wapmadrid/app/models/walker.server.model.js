'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Walker Schema
 */
var WalkerSchema = new Schema({
    firstName: {
        type: String,
        default: '',
        required: 'Please fill Walker firstName',
        trim: true
    },
    lastName: {
        type: String,
        default: '',
        required: 'Please fill Walker lastName',
        trim: true
    },
    datebirth: {
        type: Date,
        required: 'Please fill Walker date of birth',
        trim: true
    },
    sex: {
        type: String,
        default: '',
        required: 'Please fill Walker sex',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Walker', WalkerSchema);
