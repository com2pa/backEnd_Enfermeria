const mongoose= require('mongoose');

// modelo las base datos
// documents 
const serviceSchema =new mongoose.Schema({
    NameService:String,
    users:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
serviceSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

const Service = mongoose.model('Service',serviceSchema);   

module.exports = Service;