const mongoose = require('mongoose');

const hosterSchema = mongoose.Schema({
    hoster_link: {
        type: String,
        unique:true,
        required: true
    },
    token: {
        type: String
    },
    sentence: {
        type: Array,
        default: []
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

const Hoster = mongoose.model('hoster', hosterSchema);

module.exports = Hoster;