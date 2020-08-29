const { response } = require('express');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    // hago que la busqueda sea insensible a mayusculas y minusculas.
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({
            nombre: regex
        }),
        Medico.find({
            nombre: regex
        }),
        Hospital.find({
            nombre: regex
        })
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosColeccion = async (req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // hago que la busqueda sea insensible a mayusculas y minusculas.
    const regex = new RegExp(busqueda, 'i');

    let data;

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({
                nombre: regex
            });
            break;
        case 'hospitales':
            data = await Hospital.find({
                nombre: regex
            }).populate('usuario', 'nombre img');
            break;
        case 'medicos':
            data = await Medico.find({
                nombre: regex
            }).populate('usuario', 'nombre img')
              .populate('hospital', 'nombre img');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultado: data
    });
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}