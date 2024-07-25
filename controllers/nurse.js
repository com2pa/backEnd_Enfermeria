const Nurse = require('../models/nurse');
const mongoose = require('mongoose')
const nurseRouter = require('express').Router();

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


    // creo un nuevo enfermero
    const newNurse = new Nurse({
        name,
        user: user._id,
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
    }
    //
    nurse.name = name;

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

module.exports = nurseRouter;