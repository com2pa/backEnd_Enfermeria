const { request, response } = require("../app");
const patientRouter = require('express').Router();
const User = require('../models/user')
const Patient = require('../models/patient')
// correo envio
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');

patientRouter.post('/', async(request,response)=>{
    const {
        name,
        email,
        phone,
        address,
        age,
        description,
        date} =request.body;
     // verificando que todos existen 
     if(!name || !email || !phone  || !address || !age || !description || !date){
         return response.status(400).json({error:'Todos los campon son requerido'})
     }
     const patientExist = await Patient.findOne({email,name})
     if(patientExist){
         return response.status(400).json(
            {
            error:'El email y nombre ya se encuentra en uso, espera nuestra respuesta !'
        }
    )
     }
     // return response.sendStatus(200);
 
 
     // creando nuevo usuario en la base de datos
     const newPatient = new Patient({
        name,
        email,
        phone,
        address,
        age,
        description,
        date,
     })
 //     // guardando usuario registrado 
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
     // async function main() {
         // send mail with defined transport object
         await transporter.sendMail({
           from: process.env.EMAIL_USER, // sender address
           to: email, 
           cc: 'vegascom2pa@gmail.com',// list of receivers
           subject: "Solicitud de cita  ✔", // Subject line
           text: "Acontinuacion se presenta cita ", 
           html: `<p> cita: </p>
                <pre>${JSON.stringify(savedPatient, null, 2)}</pre> `, 
         });
       
 
 //     // }
     // console.log(transporter);
     return response.status(201).json(' Mensaje Enviado ! se respondera a la brevedad !',);
 
 });
 
 module.exports = patientRouter;