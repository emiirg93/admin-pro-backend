/*
    Path: '/api/hospital'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospital.controller');

const router = Router();

router.get('/', validarJWT, getHospitales);

// args (path,middleware,callback)
router.post('/',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital);

router.put('/:id',
    [
        
    ],
    actualizarHospital);

router.delete('/:id',
    [

    ],
    borrarHospital);

module.exports = router;