const mongoose = require('mongoose');

const triggerEventSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, unique: true },
        ar: { type: String},
    },
  
    description: {
       en: { type: String, required: true },
       ar: { type: String },
    },
    tags: {
        type: [String],
        required: true
    },
    
}, {
    timestamps: true
});

const TriggerEvent = mongoose.model('TriggerEvent', triggerEventSchema);

module.exports = TriggerEvent;
