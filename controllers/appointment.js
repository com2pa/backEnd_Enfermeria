const appointmentRouter = require('express').Router()
const mongoose = require('mongoose')
const Patient = require('../models/patient')


appointmentRouter.get('/', async (request, response) => {
    const user =require.user;
    if(user.role !== 'admin' ){
        return response.status(403).json('No estas autorizado para esta función');
    }
    // muestro todos los pacientes
    const patients = await Patient.find({})
    console.log('Pacientes: ', patients)

    // // muestro todos los servicios
    // const services = await Service.find({})
    // console.log('Servicios: ', services)
    // // muestro todos los enfermeros
    // const nurses = await Nurse.find({})
    // console.log('Enfermeros: ', nurses)
    
    // creo una nueva cita
    const newAppointment = new Appointment({
        patient: request.body.patientId,
        // service: request.body.serviceId,
        // nurse: request.body.nurseId,
        // date: request.body.date,
        
    })

    // guardando cita registrada
    const savedAppointment = await newAppointment.save()
    console.log('Cita guardada: ', savedAppointment)
    return response.status(201).json(savedAppointment)

    

});

module.exports = appointmentRouter;