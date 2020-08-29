const path = require('path');
const fs = require('fs');


const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        res.status(400).json({
            ok: false,
            msg: 'No es un tipo valido'
        });
    }

    // validar que exista un archivo.
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se esta enviando ninguna imagen'
        });
    }

    // procesar la imagen.
    const file = req.files.imagen;

    const nombreSeparado = file.name.split('.'); // ej : nombre.imagen.jpg = [nombre,imagen,jpg]
    const extensionArchivo = nombreSeparado[nombreSeparado.length - 1];

    // validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
    };

    // Generar nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover la imagen
    file.mv(path, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
    });

    // Actualizar DB
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo
    })

}

const getImg = (req, res = response)=>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    // imagen por defecto.

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    getImg
}