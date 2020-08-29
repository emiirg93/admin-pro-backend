require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear servidor express
const app = express();

// configurar CORS
app.use(cors());

// lectura y parseo del body
app.use( express.json());

// Base de datos
dbConnection();

// rutas
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/hospitales', require('./routes/hospital.routes'));
app.use('/api/medicos', require('./routes/medico.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/todo', require('./routes/busqueda.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto ' + process.env.PORT);
})