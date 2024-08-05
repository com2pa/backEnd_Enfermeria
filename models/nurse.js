const mongoose = require('mongoose');


// document
const nurseSchema = new mongoose.Schema({
    name: String,
    services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Service'
    }]
        
})

nurseSchema.set('toJSON',{
    Transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Nurse = mongoose.model('Nurse',nurseSchema);

module.exports = Nurse;