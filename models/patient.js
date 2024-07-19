const mongoose= require('mongoose');

// modelo las base datos
// documents 
const patientSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone: Number,
    address: String,
    age: Number,
    description: String,
    date: [{
        type: Date,
        default: Date.now,
    }],
    Services: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    doctor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
    
    
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
patientSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

const Patient = mongoose.model('Patient',patientSchema);   

module.exports = Patient;