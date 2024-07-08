const servicesRouter = require('express').Router()
const { request, response } = require('express')
const User = require('../models/user')
const Service = require('../models/service')
const jwt = require('jsonwebtoken')

// obtener todos los servicios de ese usuario
 servicesRouter.get('/', async (request,response)=>{
   //nos muestra el usuaio logiado  
    const user = request.user;
    const services = await Service.find({user: user.id})
     return response.status(200).json(services)
});

// crear un nuevo servicio
 servicesRouter.post('/', async (request,response)=>{
   
    const user = request.user;
   
    const {name, description, price, duration} = request.body;
    const newService = new Service({name, description, price, duration, user: user.id})
    await newService.save()
    return response.status(201).json(newService)
});

module.exports = servicesRouter;