const { request, response } = require("../app");
const patientRouter = require('express').Router();
const User = require('../models/user')
const Patient = require('../models/patient')
const Service = require('../models/service')
// correo envio
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');


patientRouter.get('/',async(request,response)=>{
    // verifico el rol 
   
        // obtengo todo los pacientes
        const patients = await Patient.find({})
        // console.log('todos los pacientes ',patients)
        
        // enviar al front los pacientes
        // response.status(200).json({patients})
        return response.status(200).json(patients)
    

   

})
patientRouter.post('/', async(request,response)=>{
    // 
    const {
        name,
        email,
        phone,
        address,
        age,
        description,
        serviceSelected,
        date} =request.body;

        console.log(request.body);



     // verificando que todos existen 
     if(!name || !email || !phone  || !address || !age || !description || !date || !serviceSelected){
         return response.status(400).json({error:'Todos los campon son requerido'})
     }
    //  verificar si el paciente ya esta registrado con el nombre y email
     const patientExist = await Patient.findOne({email,name})
     if(patientExist){
         return response.status(400).json(
            {
            error:'El email y nombre ya se encuentra en uso, espera nuestra respuesta !'
        }
    )
     }
     
     // creando nuevo usuario en la base de datos
     const newPatient = new Patient({
        name,
        email,
        phone,
        address,
        age,
        description,
        date,
        services: serviceSelected,
     })
    

    // guardando usuario registrado 
     const savedPatient = await newPatient.save();
     console.log('Paciente',savedPatient);
 
 
 
     // enviar correo para verificacion de usuaruio registrado
     const transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 465,
         secure: true, // Use `true` for port 465, `false` for all other ports
         auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
         },
     });
 
 //     //  como enviar el correo
            await transporter.sendMail({
           from: process.env.EMAIL_USER, // sender address
           to: [email, process.env.EMAIL_USER],
           subject: "Solicitud de cita  ✔", // Subject line
           text: "Acontinuacion se presenta cita ", 
           html: `<p> cita: </p> <pre>${JSON.stringify(savedPatient, null, 2)}</pre> `, 
         });
       
 
    
     
     return response.status(201).json(' Mensaje Enviado ! se respondera a la brevedad !');
    //  return response.status(200).json({patient:savedPatient, services:allServices})     
});
        
 module.exports = patientRouter;