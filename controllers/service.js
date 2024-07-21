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
  //   //  busco el servicio por el id que envio el usuario en el front end
  const editando = await Service.findById(request.params.id)
  console.log('antes ',editando) 
  
  // lo que envio el usuario en front  
  const{NameService} = request.body
  editando.NameService= NameService

  //  validar que el nombre no este vacio
  // if(editando.NameService == NameService  ){
  //   return response.status(400).json('El nombre no puede estar vacio o igual al anterior');  
  // }
  // si el nombre del serivicio es diferente
  if(editando.NameService !== NameService){
    // verifico si el nombre ya existe para este usuario
    const sameNameServices = await Service.find({NameService, user: user._id})
    console.log(sameNameServices) ;
    // busco si el nombre ya existe 
    if(sameNameServices.length > 0){
      // // lo borro
      // await Service.findByIdAndDelete(sameNameServices[0]._id);
      // si existe, respondo con un error 400
      return response.status(400).json('El nombre del servicio ya existe en su lista');  
    }
  }else{
        // si el nombre es diferente y no existe, guardo el nuevo nombre
        const updatedService = await editando.save();
        console.log('despues ',updatedService.NameService) ;
        
        // luego lo devuelvo
        // return response.status(200).json(updatedService);
        return response.status(200).json('modificado')
      

  }
   
});
// -----------------------------------eliminar
servicesRouter.delete('/:id', async (request,response)=>{
  //   //  busco el usuario
    const user = request.user;
    if (user.role !== 'admin') {
      return response.sendStatus(401);
    }
    // busco el id
    const elimi = await Service.findByIdAndDelete(request.params.id)
   console.log('eliminado ',elimi);
    // elimino el id del usuario en la lista de servicios
    user.Services = user.Services.filter(ser => ser.id !== request.params.id )

    // verifico si el usuario tiene servicios 
    if(user.Services.length === 0){
      // si no tiene servicios, elimino el usuario de la base de datos
      // await User.findByIdAndDelete(user._id)
      // si tiene el servicio elimino el servicio
     const eliminado_usuario= await Service.findByIdAndDelete(request.params.id)
     console.log('eliminado tabla de usuario ',eliminado_usuario); 
    } else{
      // si tiene servicios, guardo el usuario en la base de datos con los cambios realizados  // lo guardo este esta variable lo que cree
      await user.save();
    }
   
  //   // luego lo devuelvo
    return response.status(200).json('Servicio eliminado')
  });
module.exports = servicesRouter;