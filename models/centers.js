let mongoose = require('mongoose');



let Schema = new mongoose.Schema({
    
    number: {type: String, unique: true},
    name: String,
    dailyCapacity: String,
    totalNurses: String,
    startTime: String,
    endTime: String,
});


Schema.set('timestamps', true);
Schema.set('toObject', { virtuals: true, getters: true });
Schema.set('toJSON', { virtuals: true, getters: true });

module.exports = mongoose.model('centers', Schema);
