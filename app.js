require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const servicesRouter = require('./controllers/service')
const refresRouter = require('./controllers/refres')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const loginRouter = require('./controllers/login');
const { usertExtractor } = require('./middleware/auth');
const logoutRouter = require('./controllers/logout');
const patientRouter = require('./controllers/patient');
const nurseRouter = require('./controllers/nurse');
const appointmentRouter = require('./controllers/appointment');


// const morgan=require('morgan')

(async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log('Conectado a MongoDB :)');
  } catch (error) {
    console.log(error);
  }
})();
app.use(cors())
app.use(express.json());
app.use(cookieParser())
// app.use(morgan('tiny'))

// rutas backEnd
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/refres', usertExtractor, refresRouter)
app.use('/api/servicio', servicesRouter);
app.use('/api/nurse', usertExtractor, nurseRouter);
app.use('/api/cita', appointmentRouter);

// paciente
app.use('/api/patient', patientRouter);
// cita



module.exports = app;