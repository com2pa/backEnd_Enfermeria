const logoutRouter = require('express').Router();



logoutRouter.get('/',async (request, response)=>{

    const cookies = request.cookies
// verifico si el cookies existe
    if(!cookies?.accesstoken){
        // si no existe la propiedad accesstoken
        return response.status(401).json('usted no ha iniciado sesion ! ')
    }


    // borrando el cookies del navegador 
    response.clearCookie('accesstoken',{
        secure: process.env.NODE_ENV === 'production',
       httpOnly: true 
    });
    // 
    return response.sendStatus(204)
})
module.exports = logoutRouter;