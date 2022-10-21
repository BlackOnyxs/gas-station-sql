const { Router } = require('express');
const { check } = require('express-validator');

const { turnsGet, turnGetById, turnPost, turnPut, turnDelete } = require('../controllers/turn');
const { jwtValidate, fieldsValidator, isAdmin } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], turnsGet );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], turnGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('startTime', 'startTime is required').not().isEmpty(),
    check('endTime', 'endTime is required').not().isEmpty(),
    fieldsValidator
], turnPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    check('startTime', 'startTime is required').not().isEmpty(),
    check('endTime', 'endTime is required').not().isEmpty(),
    fieldsValidator
], turnPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], turnDelete );


module.exports = router;