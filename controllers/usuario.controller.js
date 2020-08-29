const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    // de esta forma puedo hacer que se ejecuten las promesas de manera simultanea.
    const [usuarios, totalRegistros ] = await Promise.all([
        Usuario.find({}, 'nombre email role img')
               .skip(desde)
               .limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        id: req.id,
        totalRegistros
    })
};

const crearUsuario = async (req, res = response) => {

    const { password, email } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: `Ya existe un usuario con el correo ${existeEmail.email}`
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }

};

const actualizarUsuario = async (req, res = response) => {
    //TODO: validar token y usuario correcto.

    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: `No existe un usuario con id : ${id}`
            });
        }

        // Actualizar.
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: `Ya existe un usuario con el email ${email}`
                });
            }
        };

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }

}
const borrarUsuario = async (req, res = response) => {

    const id = req.params.id

    try {

        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: `No existe un usuario con id : ${id}`
            });
        }

        await Usuario.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }


}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}