require('dotenv').config();
const express = require('express');
const app = express();
const mongoose= require('mongoose');
const usersRouter = require('./controllers/users');


(async()=> {
   try {

     await mongoose.connect(process.env.MONGO_URI_TEST);
     console.log('Conectado a MongoDB :)');
   } catch (error) {
    console.log(error);
   }
})()

// rutas backEnd
app.use('/app/users', usersRouter);

module.exports = app;