const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Conexion exitosa');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD');
    }

}

module.exports = {
    dbConnection
}