const mongoose= require('mongoose');

// modelo las base datos
// documents 
const userPacientesSchema =new mongoose.Schema({
    name: String,    
    edad: Number,
    phone: Number,        
    email:String,        
    direction: String,       
    fecha:{
        type:Date,
        default:Date.now,
    },    
    description: String,
    Services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }]
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
userPacientesSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

const UserPaciente = mongoose.model('UserPaciente',userPacientesSchema);   

module.exports = UserPaciente;