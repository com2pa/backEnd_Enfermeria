const mongoose = require('mongoose');
const { Transform } = require('nodemailer/lib/xoauth2');

// document
const nurseSchema = new mongoose.Schema({
    name: String,
        
})

nurseSchema.set('',{
    Transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Nurse = mongoose.model('Nurse',nurseSchema);

module.exports = Nurse;