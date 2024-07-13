const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
loginRouter.post('/', async(request,response)=>{
    const {email, password} = request.body
   
    // verificando si el usuario existe
   const userExist = await User.findOne({email}) 
    // console.log(userExist);
    if(!userExist){
        return response.status(400).json({error:'email o contraseña invalida por favor revisar!'})
    }
        
    // // si el usuario esta verificado
    if(!userExist.verificacion){
        return response.status(400).json({error:'Tu! email no ha sido verificado por favor revisar!'})

    }  
    // verificando si la contraseña es correcta
    // const saltRounds = 10;
    const isCorrect= await bcrypt.compare(password, userExist.password)
    if(!isCorrect){
        return response.status(400).json({error:'email o contraseña invalida por favor revisar!'})
    }
    // creando el token
    // saber el id  y el nombre de quien inicio session
    const userForToken = {
        id: userExist.id,
        name: userExist.name,
        role: userExist.role,
        // email: userExist.email,
        // verificacion: userExist.verificacion
    }
    console.log('incio sesion !',userForToken)

    // el token dura 1 un dia!
    // recomienta para cada pagina tener una contraseña encriptada
    // cuanto tiempo quiere que se quede inicia la sesion 1dia eso dependera de que se quiera
    const accesstoken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // console.log(new Date());
                                //  milisegundo segundo minutos  horas  por cuanto dia 1                              
    // console.log(new Date(Date.now()+ 1000 * 60 * 60 * 24 * 1 ));


    // guardarlo en las cookies
    // expires: new Date(Date.now() + 900000 // 15min
    response.cookie('accesstoken', accesstoken, { 
       expires: new Date(Date.now()+ 1000 * 60 * 60 * 24 * 1 ),
       secure: process.env.NODE_ENV === 'production',
       httpOnly: true  // solo puede ser accedido por el server
    }); // 1dia
    
    
    // return response.sendStatus(200);
    return response.status(200).json(userForToken);
    

 });
 
 module.exports = loginRouter; 