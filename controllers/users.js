const { request, response } = require("../app");

const usersRouter = require('express').Router();

usersRouter.post('/', async(request,response)=>{
   const {name,
    email,        
    phone,        
    password,} =request.body;
    // console.log(name,
    //     email,        
    //     phone,        
    //     password);
});

module.exports = usersRouter;
