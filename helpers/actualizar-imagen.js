const fs = require('fs');

const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    let pathViejo = '';
    console.log('llego a actualizar imagen')

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImg(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImg(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImg(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

};

const borrarImg = (path) => {
    if (fs.existsSync(path)) {
        // borrar la imagen anterior.
        fs.unlinkSync(path);
    }
}

module.exports = {
    actualizarImagen
}