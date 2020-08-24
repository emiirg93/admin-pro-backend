const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar email

        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'contraseña incorrecto'
            })
        }

        // generar token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

module.exports = {
    login,
}