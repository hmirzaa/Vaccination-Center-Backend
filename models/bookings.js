let mongoose = require('mongoose');



let Schema = new mongoose.Schema({
    
    nric_number: { type: String, default: null },
    full_name: { type: String, default: null },
    center: { type: String, default: null },
    slot : { type : Date, default: Date.now },
    isActive: {type: Boolean, default: true}
});


Schema.set('timestamps', true);
Schema.set('toObject', { virtuals: true, getters: true });
Schema.set('toJSON', { virtuals: true, getters: true });

module.exports = mongoose.model('bookings', Schema);
