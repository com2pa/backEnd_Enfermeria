const mongoose= require('mongoose');
// modelo las base datos
// documents 
const userSchema =new mongoose.Schema({
    name: String,    
    edad: Number,
    phone: Number,        
    email:String,        
    password:String,        
    role:{
        type:String,
        default:'USER_ROLE'
    },    
    fecha:{
        type:Date,
        default:Date.now,
    },    
    verificacion:{
        type:Boolean,
        default:false
    },
    Services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }]
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
userSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password; 
    }
})

const User = mongoose.model('User',userSchema);   

module.exports = User;