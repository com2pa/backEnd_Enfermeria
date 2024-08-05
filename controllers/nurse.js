const Nurse = require('../models/nurse');
const mongoose = require('mongoose')
const nurseRouter = require('express').Router();
const Service = require('../models/service')

nurseRouter.get('/', async (request, response) => {
    // nos muestra el usuario logiado 
    const user = request.user;
   
    // muestra todos los enfermeros
    const nurses = await Nurse.find({});
  
    return response.status(200).json( nurses);
    

});
// ----------------- crear enfermero
nurseRouter.post('/', async(request,response)=>{
    // busco al usuario
    const user = request.user;
    if (user.role !== 'admin') {
        return response.status(403).json('No estas autorizado para esta funcion');
    }
    // lo que envia el usuario en el front end
    const {name} = request.body
    console.log('se envia enfermero : ',name)
    // console.log('se envia id : ',servicioId)

    


    // creo un nuevo enfermero
    const newNurse = new Nurse({
        name,
        user: user.id,
        
    })
    // guardando enfermero registrado
    const savedNurse = await newNurse.save();
    console.log('se guarda el enfemero registrado ', savedNurse);

    return response.status(201).json(savedNurse)

})
// ----------------editar enfermero

nurseRouter.put('/:id', async(request, response)=>{
    // busco al usuario
    const user = request.user;
    if (user.role!== 'admin') {
        return response.status(403).json('No estas autorizado para esta funcion');
    }
    // lo que envia el usuario en el front end
    const {name} = request.body
    
    console.log('se envia enfermero : ',name)
    

    // busco el enfermero
    const nurse = await Nurse.findById(request.params.id);
    if (!nurse) {
        return response.status(404).json('No se encontro el enfermero');
    }else{
        nurse.name = name;
   
    }
    // guardando enfermero modificado
    const updatedNurse = await nurse.save();
    console.log('se guarda el enfermero modificado', updatedNurse)
    return response.status(200).json(updatedNurse) 
    
});

// ----- eliminar 

nurseRouter.delete('/:id', async(request, response)=>{
    // busco al usuario
    const user = request.user;
    if (user.role!== 'admin') {
        return response.status(401).json('No estas autorizado para esta funcion');
    }
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(400).json('Invalid ObjectId');
    }
    // busco el enfermero
    const nurse = await Nurse.findByIdAndDelete(request.params.id);
    console.log('eliminado ',nurse)

    // verifico el enfermero
    if (!nurse) {
        return response.status(404).json('No se encontro el enfermero');
    }

    // eliminando el enfermero
//    const eliminando = await nurse.remove();
    // console.log('se elimina el enfermero',)
    


    return response.status(200).json('enfermero eliminado')
});





// actualizar service

nurseRouter.patch('/:id', async(request, response) => {
//     // busco al usuario
//     const user = request.user;
//     if (user.role !== 'admin') {
//         return response.status(403).json('No estas autorizado para esta funcion');
//     }

// //    Obtengo lo que me envia el frontend

//     const {serviceId} = request.body
//     console.log(serviceId,'id del servicio')

// // //    Busco el enfermero
//        const nurse = await Nurse.findById(request.params.id);
//     if (!nurse) {
//         return response.status(404).json('Enfermero no encontrado');
//     }
//     // verifico s hay servicio agregado al enfermero
//     if(nurse.services.some(serv => serv.service.toString() === serviceId)){
//         return response.status(400).json('El enfermero ya tiene este servicio agregado');
//     }
//         // añado el servicio
//         nurse.services.push({services: serviceId});
//         // guardo el enfermero
//         await nurse.save();
//         console.log('se agrego el servicio al enfermero', nurse.services)
//         // lo devuelvo
//         return response.status(200).json(nurse);
    const newServices =  await Nurse.findByIdAndUpdate(request.params.id, {services: request.body.services}, {new:true})
    if(!newServices){
        return response.status(400).json({error:'enfermero o servicio no existe'})

    }
    console.log('agregado servicio al enfermero',newServices)
    return response.status(200).json('servicio actualizado')

});

module.exports = nurseRouter;