const { response } = require("express");
const Hospital = require('../models/hospital.model');

const getHospitales = async (req,res = response) => {

    const hospitales = await Hospital.find().populate('usuario','nombre img');

    res.json({
        ok:true,
        hospitales
    })
};

const crearHospital = async (req,res = response) => {

    const id = req.id;
    const hospital = new Hospital({
        usuario: id,
        ...req.body
    });

    try{

        const hospitalDB = await hospital.save();

        res.json({
            ok:true,
            hospitalDB
        })
    }catch(err){
        res.status(500).json({
            ok:false,
            msg:'Error interno del servidor'
        })
    }

};

const actualizarHospital = (req,res = response) => {
    res.json({
        ok:true,
        msg: 'actualizarHospital'
    })
};

const borrarHospital = (req,res = response) => {
    res.json({
        ok:true,
        msg: 'borrarHospital'
    })
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}