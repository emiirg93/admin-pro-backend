const { response } = require("express");
const Medico = require('../models/medico.model');

const getMedicos = async (req,res = response) => {

    const medicos = await Medico.find().populate('usuario','nombre img')
                                 .populate('hospital', 'nombre img')

    res.json({
        ok:true,
        medicos
    })
};

const crearMedico = async (req,res = response) => {

    const id = req.id;

    const medico = new Medico({
        usuario: id,
        ...req.body
    })

    try{

        const medicoDB = await medico.save();

        res.json({
            ok:true,
            medicoDB
        })
    }catch(err){
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }


};

const actualizarMedico = (req,res = response) => {
    res.json({
        ok:true,
        msg: 'actualizarMedico'
    })
};

const borrarMedico = (req,res = response) => {
    res.json({
        ok:true,
        msg: 'borrarMedico'
    })
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}