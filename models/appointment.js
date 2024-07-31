// citas
const mongoose = require('mongoose')


// Definimos el esquema de la colección de citas

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    nurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse'
    },    
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada'],
        default: 'pendiente'
    }   

})

// Transformamos el esquema para que las IDs se serializen en lugar de los objetos complejos
appointmentSchema.set('toJSON',{
    Transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

// Exportamos el modelo de cita

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment;