const { request, response } = require("../app");

const usersRouter = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async(request,response)=>{
   const {name,
    email,        
    phone,        
    password,} =request.body;
    // verificando que todos existen 
    if(!name || !email || !phone || !password ){
        return response.status(400).json({error:'Todos los campon son requerido'})
    }
    // return response.sendStatus(200);

    // encriptando la constraseña
    const saltRounds = 10;
    const passwordHash= await bcrypt.hash(password,saltRounds)
    console.log(passwordHash);
    // creando nuevo usuario en la base de datos
    const newUser = new User({
        name,email,phone,password:passwordHash
    })
    // guardando usuario registrado 
    const savedUser = await newUser.save();
    console.log(savedUser);

    // enviar correo para verificacion de usuaruio registrado



});

module.exports = usersRouter;
