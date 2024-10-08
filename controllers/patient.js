const { request, response } = require("../app");
const patientRouter = require('express').Router();
const User = require('../models/user')
const Patient = require('../models/patient')
const Service = require('../models/service')
// correo envio
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');
const { usertExtractor } = require("../middleware/auth");


patientRouter.get('/',async(request,response)=>{
    // verifico el rol 
   
        // obtengo todo los pacientes
        const patients = await Patient.find({}).populate('services', 'NameService')
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
        time,
        date} =request.body;
        console.log(request.body);



     // verificando que todos existen 
     if(!name || !email || !phone  || !address || !age || !description || !date || !serviceSelected || !time){
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
    // comparamos time si ya existe el mismo dia 

     const existeCita = await Patient.findOne({
        
        services: serviceSelected,
        time,
     });
     if(existeCita){
         return response.status(400).json({error:'Ya hay una cita para este paciente en este horario, ingrese otra otra para verificar si esta disponible , sino ingrese otro dia  '})
     }else{
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
            time,
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
        //   html: `<p> cita: </p> <pre>${JSON.stringify(savedPatient, null, 2)}</pre> `, 
            html: `<p> cita: </p> 
                <ul>
                    <li>Nombre: ${savedPatient.name}</li>
                    <li>Email: ${savedPatient.email}</li>
                    <li>Teléfono: ${savedPatient.phone}</li>
                    <li>Fecha: ${savedPatient.date}</li>
                    <li>Hora: ${savedPatient.time}</li>
                </ul>`, 
        });
          
    return response.status(201).json(' Mensaje Enviado ! se respondera a la brevedad !');
   

     }
   
});
//eliminar

patientRouter.delete('/:id',  async(request, response)=>{
    // busco al usuario
    // const user = request.user;
    // if (user.role!== 'admin') {
    //     return response.sendStatus(401);
    // }
    // busco al paciente
    const patient = await Patient.findByIdAndDelete(request.params.id);
    if(!patient){
        return response.status(404).json({error:'El paciente no existe'})
    }
    console.log('se elimino la cita ', patient)
    return response.status(200).json('El paciente ha sido eliminado')
}); 
// actualizar el status

patientRouter.patch('/:id',  async(request, response)=>{
    // busco al paciente
    const patient = await Patient.findByIdAndUpdate(request.params.id, {status: request.body.status}, {new: true});
    if(!patient){
        return response.status(404).json({error:'El paciente no existe'})
    }
    console.log('actualizado el status ', patient)

    // verifico si el paciente esta status espera
    if(patient.status == "espera"){
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
           //  como enviar el correo
              await transporter.sendMail({
             from: process.env.EMAIL_USER, // sender address
             to: [patient.email, process.env.EMAIL_USER],
             subject: "Solicitud de cita  ✔", // Subject line
             text: "Acontinuacion se presenta cita ", 
             html: `<p> Su cita esta en al modalidad de espera</p>`, 
           });         

    }else if(patient.status == 'finalizado'){
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
        to: [patient.email, process.env.EMAIL_USER],
        subject: "Solicitud de cita  ✔", // Subject line
        text: "Acontinuacion se presenta cita ",     
        html: ` <p> su cita a finalizado </p>`, 
    });
    }
    

    return response.status(200).json('El status del paciente ha sido actualizado')
});
 module.exports = patientRouter;