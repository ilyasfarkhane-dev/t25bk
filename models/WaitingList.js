const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tele:{type: Number, required: true,unique:false},
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaitingList', waitingListSchema);
