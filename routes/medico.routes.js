/*
    Path: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medico.controller');

const router = Router();

router.get('/', validarJWT , getMedicos);

// args (path,middleware,callback)
router.post('/',
    [
        validarJWT,
        check('nombre','El nombre del medico es requerido.').not().isEmpty(),
        check('hospital','El id del hospital es requerido.').not().isEmpty(),
        check('hospital','El id del hospital no es valido.').isMongoId(),
        validarCampos
    ],
    crearMedico);

router.put('/:id',
    [

    ],
    actualizarMedico);

router.delete('/:id',
    [

    ],
    borrarMedico);

module.exports = router;