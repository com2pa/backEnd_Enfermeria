const mongoose= require('mongoose');

// modelo las base datos
// documents 
const userShema =new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },    
    edad:Number,
    telefono:{
        type:Number,
        required:true
    },
    correo:{
        type:String,
        required:true
    },
    contraseña:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'USER_ROLE'
    },
    img:{
        type:String,
        default:"default.png"
    },
    fecha:{
        type:Date,
        default:Date.now
    },
    
    verificacion:{
        type:Boolean,
        default:false
    }
    
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
userShema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.contraseña; 
    }
})

const User = mongoose.model('User',userShema);   

module.exports = userShema;