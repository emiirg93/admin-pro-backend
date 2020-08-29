/* 
    Path : api/upload/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, getImg } = require('../controllers/upload.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT , fileUpload);

router.get('/:tipo/:foto', validarJWT , getImg);

module.exports = router;