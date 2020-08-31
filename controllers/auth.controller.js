const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar email

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
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

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // verificar si ya existe el usuario.

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        // si no existe el usuario.
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: 'autentificacionGoogle',
                img: picture,
                google: true
            })
        }else{
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            usuario.password = 'autentificacionGoogle';
            usuario.img = picture;
        }

        // guardar en db

        await usuario.save();

        // generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'token no es correcto',
        });
    }
}

module.exports = {
    login,
    googleSignIn
}