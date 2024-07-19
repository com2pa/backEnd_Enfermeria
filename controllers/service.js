const servicesRouter = require('express').Router()
const { request, response } = require('express')
const User = require('../models/user')
const Service = require('../models/service')
const jwt = require('jsonwebtoken')

// obtener todos los servicios de ese usuario
 servicesRouter.get('/', async (request,response)=>{
   //nos muestra el usuaio logiado  
    const user = request.user;
    // nos muestra todas las servicio de esa persona
    const services = await Service.find({});
     return response.status(200).json(services)
     
});

// ----------------------------------crear un nuevo servicio
 servicesRouter.post('/', async (request,response)=>{
//   //  busco el usuario
  const user = request.user;

  if (user.role !== 'admin') {
    return response.status(403).json('No estas autorizado para esta funcion');
  }
//   //  lo que envia el usuario en el front end
  const {NameService} = request.body
  console.log(NameService)

//   // creo un nuevo servicio o categoria
//                           // uso el modelo creado service (la tabla de base de datos)
  const newServicio = new Service({
    NameService,
    user: user._id,
  })
// //   // lo guardo este esta variable lo que cree
   const savedService = await newServicio.save();

//   // agregando servicio creo al usuario
  user.Services = user.Services.concat(savedService.id);
  await user.save();

//   // luego lo devuelvo
    return response.status(201).json(savedService);
});
//-------------------------------------- editar 
servicesRouter.put('/:id' ,async(request, response)=>{
  //   //  busco el usuario
  const user = request.user;
  if (user.role!== 'admin') {
    return response.status(401).json('No estas autorizado para esta funcion');
  }
 
  const editando = await Service.findById(request.params.id);

  if(!editando){
    return response.status(404).json('Servicio no encontrado');
  }
  // guardamos la actualizacion
  const updatedService = await editando.save();

  // devuelvo una respuesta
  return response.status(200).json(updatedService);
})

// -----------------------------------eliminar
servicesRouter.delete('/:id', async (request,response)=>{
  //   //  busco el usuario
    const user = request.user;
    if (user.role !== 'admin') {
      return response.sendStatus(401);
    }
   const elimi = await Service.findByIdAndDelete(request.params.id)
  //  console.log(elimi);
    user.Services = user.Services.filter(ser => ser.id !== request.params.id )
    await user.save();
  //   // luego lo devuelvo
    return response.status(200).json('Servicio eliminado')
  });
module.exports = servicesRouter;